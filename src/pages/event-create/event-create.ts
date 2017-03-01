import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Event } from "api/models/app-models";

@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html'
})
export class EventCreatePage {
  event: Event = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}


}
