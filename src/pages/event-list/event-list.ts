import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Event } from "api/models/app-models";
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import 'rxjs/add/operator/map'

import { EventCreatePage } from '../event-create/event-create';
import { EventDetailPage } from '../event-detail/event-detail';

@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html'
})
export class EventListPage {
  events: FirebaseListObservable<any>;
  eventsCount: number;
  eventList: Event[];
  loadedEventList: Event[];

  constructor(
    public af: AngularFire,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.events = this.af.database.list('/events');
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

  pushToEventCreate() {
    this.navCtrl.push(EventCreatePage);
  }
}
