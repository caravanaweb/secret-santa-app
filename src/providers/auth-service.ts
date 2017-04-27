import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';

@Injectable()
export class AuthService {
  private authState: FirebaseAuthState;

  constructor(
    public auth$: AngularFireAuth,
    public facebook: Facebook,
    public platform: Platform
  ) {
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  displayName(): string {
    if (this.authState != null) {
      return this.authState.facebook.displayName;
    } else {
      return '';
    }
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  signInWithFacebook(): firebase.Promise<any> {
    if (this.platform.is('cordova')) {
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      });
    } else {
      return this.auth$.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup
      });
    }
  }

  signOut(): void {
    this.auth$.logout();
  }
}
