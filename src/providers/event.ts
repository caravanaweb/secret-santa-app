import { Injectable } from '@angular/core';
import { FirebaseProvider } from "./firebase";
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable()
export class EventProvider {
  public eventPictureRef: any;

  constructor(
    public firebaseProvider: FirebaseProvider,
  ) {
    this.eventPictureRef = firebase.storage().ref('/events');
  }

  uploadEventPicture(eventKey, picture, type?): Promise<any> {
    if (type === 'base64') {
      return this.eventPictureRef.child(eventKey).child('event-picture.png')
          .putString(picture, 'base64', {contentType: 'image/png'});
    } else {
      return this.eventPictureRef.child(eventKey).child('event-picture.png').put(picture);
    }
  }
}
