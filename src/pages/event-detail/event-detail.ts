import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Event } from 'api/models/app-models';

@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  selectedEvent: Event;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.selectedEvent = <Event>navParams.get('event');
  }
}
