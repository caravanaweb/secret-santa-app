import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventCreatePage } from '../event-create/event-create';

@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html'
})
export class EventListPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  pushToEventCreate() {
    this.navCtrl.push(EventCreatePage);
  }
}
