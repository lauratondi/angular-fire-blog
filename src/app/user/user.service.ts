import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { User } from './user.model';
import { AuthService } from '../core/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {}

  getUsers() {
    this.userCollection = this.afs.collection('users');
    return this.userCollection.valueChanges();
  }

  getUser(id: string | null) {
    this.userDoc = this.afs.doc<User>(`users/${id}`);
    return this.userDoc.valueChanges();
  }

  updateProfileData(displayName: string, photoURL: string) {
    // we get the current user
    const user = this.auth.authState;
    // we get the data from the component and save it in the data variable
    const data = { displayName, photoURL };
    // we save the data in the FB object
    return (
      user
        .updateProfile(data)
        // here we save it on our own database
        .then(() =>
          this.afs.doc(`users/${user.uid}`).update({ displayName, photoURL })
        )
        .then(() => console.log('Your profile has been updated!'))
        .catch((error: any) => console.log(error.message))
    );
  }

  updateEmailData(email: string) {
    const user = this.auth.authState;
    return user
      .updateEmail(email)
      .then(() => this.afs.doc(`users/${user.uid}`).update({ email }))
      .then(() => console.log('Your email has been updated to: ' + email))
      .then((user: User) => {
        this.auth.authState
          .sendEmailVerification()
          .then(() => console.log('We sent an email verification'))
          .catch((error: any) => console.log(error.message));
      })
      .catch((error: any) => console.log(error.message));
  }

  updateUserData(data: any) {
    const uid = this.auth.currentUserId;
    return this.afs.doc(`users/${uid}`).update(data);
  }
}
