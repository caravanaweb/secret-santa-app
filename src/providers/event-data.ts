import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Event, User } from "api/models/app-models";
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class EventData {
  events: FirebaseListObservable<Event>;
  public eventPictureRef: any;

  constructor(
    public af: AngularFire
  ) {
    this.events = af.database.list('/events');
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
