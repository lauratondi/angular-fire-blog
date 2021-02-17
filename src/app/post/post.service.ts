import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  postCollection: AngularFirestoreCollection<Post>;
  postDoc: AngularFirestoreDocument;

  constructor(private afs: AngularFirestore) {
    this.postCollection = this.afs.collection('posts', (ref) =>
      ref.orderBy('trending', 'desc').limit(10)
    );
  }

  getPosts(): Observable<Post[]> {
    return this.postCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Post;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  // It's just a reference to display in the DB
  getPost(id: string) {
    return this.afs.doc<Post>(`posts/${id}`);
  }

  // Is returning an Observable
  getPostData(id: string | any) {
    this.postDoc = this.afs.doc<Post>(`posts/${id}`);
    return this.postDoc.valueChanges();
  }

  create(data: Post) {
    return this.postCollection.add(data);
  }

  delete(id: string) {
    return this.getPost(id).delete();
  }

  update(id: any, formData: any) {
    return this.getPost(id).update(formData);
  }
}
