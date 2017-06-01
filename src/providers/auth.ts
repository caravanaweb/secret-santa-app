import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {

  constructor(
    private afAuth: AngularFireAuth,
    private facebook: Facebook,
    private platform: Platform
  ) {}

  isUserLoggedIn() {
    return this.afAuth.authState.subscribe((user: firebase.User) => {
      return user;
    });
  }

  signInWithFacebook() {
    if (this.platform.is('cordova')) {
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    } else {
      return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    }
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }
}
