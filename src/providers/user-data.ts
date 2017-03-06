import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from 'api/models/app-models';

@Injectable()
export class UserData {
  currentUser: User;

  constructor(
    public storage: Storage
  ) {}

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

  setProfile(fireAuth) {
    this.currentUser.uid = fireAuth.authState.auth.uid;
    this.currentUser.name = fireAuth.authState.auth.displayName;
    this.currentUser.email = fireAuth.authState.auth.email;
    this.currentUser.picture = fireAuth.authState.auth.photoUrl;
    this.storage.set('currentUser', this.currentUser);
  }
}
