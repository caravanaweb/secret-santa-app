import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Event } from "api/models/app-models";
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { EventListPage } from '../../pages/event-list/event-list';

@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html'
})
export class EventCreatePage {
  event: Event = {};
  events: FirebaseListObservable<Event>;
  minDate: string;
  minEventDate: string;
  today: Date;
  submitted: boolean = false;

  constructor(
    af: AngularFire,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.today = new Date();
    this.minDate = this.today.toISOString().substring(0,10);
    this.event.raffleDate = this.minDate;
    this.events = af.database.list('/events');
  }

  onRaffleDateAccept(event) {
    this.minEventDate = new Date(event.year.value, event.month.value-1, event.day.value).toISOString().substring(0,10);
    console.log('this.minEventDate',this.minEventDate);
  }

  onEventCreate(form) {
    this.submitted = true;

    if (form.valid) {
      this.events.push(this.event).then(res => {
        this.navCtrl.push(EventListPage);
      });
    }
  }
}
