import { Injectable } from '@angular/core';
import { Event } from "api/models/app-models";
import { FirebaseProvider } from "./firebase";
import { FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable()
export class EventProvider {
  events: FirebaseListObservable<Event>;
  public eventPictureRef: any;

  constructor(
    public firebaseProvider: FirebaseProvider,
  ) {
    this.events = firebaseProvider.getList('/events');
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

  updateEventPicture(eventKey, pictureUrl) {
    return this.events.update(eventKey, {'picture': pictureUrl});
  }
}
