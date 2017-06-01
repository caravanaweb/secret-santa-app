import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from 'api/models/app-models';
import { FirebaseProvider } from './firebase';


@Injectable()
export class UserProvider {
  currentUser: User;

  constructor(
    public firebaseProvider: FirebaseProvider,
    public storage: Storage
  ) {}

  checkUserAccount(user) {
    return this.firebaseProvider.query('/users', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'uid',
        equalTo: user.uid
      }
    });
  }

  getProfile() {
    return this.storage.get('currentUser');
  }

  getProfileId() {
    return this.storage.get('uid');
  };

  getProfilePicture() {
    return this.storage.get('picture');
  };

  setProfilePicture(photoUrl) {
    this.storage.set('picture', photoUrl);
  };

  setProfileId(uid) {
    this.storage.set('uid', uid);
  };

  setProfile(user) {
    return this.storage.set('currentUser', user);
  }
}
