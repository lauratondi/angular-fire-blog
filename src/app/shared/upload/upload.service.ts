import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  downloadURL: Observable<string>;
  uploads: AngularFirestoreCollection<any>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  uploadTask(path: any, file: any, meta: any, uploadType: boolean) {
    const nameHash = Md5.hashStr(file.name + new Date().getTime());
    const fileExt = file.type.split('/')[1];
    const name = `${nameHash}.${fileExt}`;

    const newMeta = {
      ...meta,
      someMoredata: 'Moore data',
    };

    const ref = this.storage.ref(`${path}/${name}`);
    const task = ref.put(file, { customMetadata: newMeta });
    // const task = this.storage.upload(file, { customMetadata: newMeta });

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe((url) => {
            this.downloadURL = url;
            console.log('Image Uploaded!');
            console.log(url);
          });
        })
      )
      .subscribe();

    if (uploadType === true) {
      // SAVING AS COLLECTION
      // We got the file, Now we need to save it to the DT telling the path
      this.uploads = this.afs.collection(path);
      // Since we cannot save an Observable in the DT we need to get the dowloadURL, we subscribe to the obs
      // and we exctarct the URL
      ref.getDownloadURL().subscribe((url) => {
        console.log('save as collection');
        // we add the url to an object with the name
        const data = { name, url };
        // and we save it in the DT

        return this.uploads.add(data);
      });
    }
    // SAVING AS A DOCUMENT FIELD
    else {
      ref.getDownloadURL().subscribe((downloadURL) => {
        console.log('saved as document field');
        this.afs.doc(path).update({ downloadURL });
      });
    }
  }
}
