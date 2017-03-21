import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Event } from 'api/models/app-models';

@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  selectedEvent: Event;
  staticMapImage: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.selectedEvent = <Event>navParams.get('event');

    this.staticMapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${this.selectedEvent.location}&zoom=17&size=640x640&markers=${this.selectedEvent.location}&key=AIzaSyAbeCFDXgQbjDU2-usm3rQNF1F3U6zj7Iw`;
  }

  getDirections() {
    window.open(`https://maps.google.com/?q=${this.selectedEvent.location}`, '_system');
  }
}
