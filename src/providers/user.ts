import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from 'api/models/app-models';
import { AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirebaseProvider } from './firebase';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserProvider {
  userCollections: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  currentUser: User;

  constructor(
    public firebaseProvider: FirebaseProvider,
    public storage: Storage
  ) {}

  checkUserAccount(user) {
    this.userCollections = this.firebaseProvider.query('/users', ref => {
      return ref.where('uid', '==', user.uid);
    });
    return this.userCollections.snapshotChanges();
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
