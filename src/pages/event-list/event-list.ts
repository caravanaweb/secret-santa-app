import { Component } from '@angular/core';
import { Events, NavController, IonicPage } from 'ionic-angular';
import { Event, User } from "api/models/app-models";
import { FirebaseProvider } from '../../providers/firebase'
import { Observable } from 'rxjs/Observable';

import { UserProvider } from '../../providers/user';
import { AngularFirestoreCollection } from 'angularfire2/firestore';

@IonicPage({
  segment: 'events'
})
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html'
})
export class EventListPage {
  private eventCollection: AngularFirestoreCollection<Event>;
  events: Observable<Event[]>;
  eventList: Event[];
  loadedEventList: Event[];
  account: User;
  eventsCount: number;

  constructor(
    public firebaseProvider: FirebaseProvider,
    public navCtrl: NavController,
    public userProvider: UserProvider,
    public utilEvents: Events
  ) {
    this.userProvider.getProfile().then(user => {
      this.account = JSON.parse(user);
    });
    this.eventCollection = firebaseProvider.afs.collection<Event>('events');
    this.events = this.eventCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Event;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
    
    this.events.subscribe(data => {
      this.eventsCount = data.length;
    });
  }

  initializeEvents(): void {
    this.eventList = this.loadedEventList;
  }

  getItems(ev: any) {
    this.initializeEvents();
    let q = ev.target.value;

    if (!q) return;

    this.eventList = this.eventList.filter((v) => {
      if (v.title && q) {
        if (v.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  goToEventCreate() {
    this.navCtrl.push('EventCreatePage');
  }

  goToEventPage(event) {
    this.navCtrl.push('EventDetailPage', {
      'id': event.id
    });
  }

  logout() {
    this.utilEvents.publish('user:logout');
  }
}
