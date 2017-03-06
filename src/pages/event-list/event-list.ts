import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Event } from "api/models/app-models";
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import 'rxjs/add/operator/map'

import { EventCreatePage } from '../event-create/event-create';

@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html'
})
export class EventListPage {
  events: FirebaseListObservable<Event>;
  eventsCount: number;

  constructor(
    public af: AngularFire,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.events = this.af.database.list('/events');
    this.af.database.list('/events').map(list=>list.length).subscribe(length => {
      this.eventsCount = length;
    });
  }

  pushToEventCreate() {
    this.navCtrl.push(EventCreatePage);
  }
}
