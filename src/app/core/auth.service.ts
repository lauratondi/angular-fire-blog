import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';

interface User {
  uid: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<User> | any;

  authState: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.afAuth.authState.subscribe((data) => {
      this.authState = data;
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : null;
  }

  emailSignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => console.log(`You have successfully signed in ${email}`))
      .catch((error) => console.log(error.message));
  }

  emailSignUp(email: string, password: string) {
    console.log(this.user);
    return (
      this.afAuth
        // We create a user and we pass it to Firebase
        .createUserWithEmailAndPassword(email, password)
        // Firebase send back the user with the data from firebase. In firebase we've created an User Object
        // That contains uid, email, ... We take the user that comes back from FB and pass it in the updateUserData
        .then((data) => this.updateUserData(data.user))
        .then(() => console.log('Welcome! Your account has been created'))
        .then(() => {
          this.afAuth.currentUser
            .then((user) => {
              return user
                ?.sendEmailVerification()
                .then(() => console.log('We sent you an email verification'))
                .catch((error: any) => console.log(error.message));
            })
            .catch((error) => console.log(error.message));
        })
    );
  }

  resetPassword(email: string) {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => console.log('We sent you a password reset link'));
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialLogin(provider);
  }

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.socialLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialLogin(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.socialLogin(provider);
  }

  private socialLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((credential) => {
        return this.updateUserData(credential);
      })
      .catch((error) => console.log(error.message));
  }

  private updateUserData(user: any) {
    console.log(user);
    // We reference the AngularFS document, and give it a path where to store it
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    // we create the  data object, we add the user details
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName,
      photoURL:
        user.photoURL ||
        'http://www.gravatar.com/avatar/' +
          Md5.hashStr(user.uid) +
          '?d=identicon',
    };
    //  we save the user here, adding merge to avoid distraction
    return userRef.set(data, { merge: true });
  }
}
