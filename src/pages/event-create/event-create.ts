import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { Event, User } from "api/models/app-models";
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { UserData } from '../../providers/user-data';
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
  currentUser: User;

  constructor(
    public af: AngularFire,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserData,
    public utilEvents: Events
  ) {
    this.today = new Date();
    this.minDate = this.today.toISOString().substring(0,10);
    this.event.raffleDate = this.minDate;
    this.events = af.database.list('/events');
  }

  ngAfterViewInit() {
    this.userData.getProfile().then(profile => {
      this.currentUser = JSON.parse(profile);
    });
  }

  onRaffleDateAccept(event) {
    this.minEventDate = new Date(event.year.value, event.month.value-1, event.day.value).toISOString().substring(0,10);
  }

  addAdminToEvent(eventId) {
    let eventAttendees: any;
    let user = this.currentUser;

    eventAttendees = this.af.database.list(`/eventAttendees/${eventId}`);
    return eventAttendees.update(user.$key, {
      name: user.name,
      gift: user.gift,
      picture: user.picture,
      admin: true
    });
  }

  onEventCreate(form) {
    this.submitted = true;
    let eventData: Event;
    let eventKey: string;

    if (form.valid) {
      eventData = this.event;
      eventData.ownership = this.currentUser.uid;
      eventKey = this.events.push(eventData).key;

      this.addAdminToEvent(eventKey).then(_ => {
        this.utilEvents.publish('message:show', `O Amigo Secreto "${this.event.title}" foi criado com sucesso.`, 'success');
        this.navCtrl.push(EventListPage);
      });
    }
  }
}
