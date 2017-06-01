import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { Event, User } from "api/models/app-models";
import { FirebaseProvider } from '../../providers/firebase'
import { FirebaseListObservable } from 'angularfire2/database';

import { EventCreatePage } from '../event-create/event-create';
import { EventDetailPage } from '../event-detail/event-detail';
import { UserProvider } from '../../providers/user';

@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html'
})
export class EventListPage {
  events: FirebaseListObservable<any>;
  eventsCount: number;
  eventList: Event[];
  loadedEventList: Event[];
  account: User;

  constructor(
    public firebaseProvider: FirebaseProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public utilEvents: Events
  ) {
    this.userProvider.getProfile().then(user => {
      this.account = JSON.parse(user);
    });
    this.events = firebaseProvider.getList('/events');
    this.events.subscribe(snapshots => {
      let events = [];
      snapshots.forEach(snapshot => {
        events.push(snapshot);
      });

      this.loadedEventList = this.eventList = events;
      this.eventsCount = events.length;
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

  goToEventPage(event) {
    this.navCtrl.push(EventDetailPage, {
      'eventId': event.$key,
      'event': event
    });
  }

  logout() {
    this.utilEvents.publish('user:logout');
  }

  pushToEventCreate() {
    this.navCtrl.push(EventCreatePage);
  }
}
