import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { EventListPage } from '../event-list/event-list';
import { Event } from 'api/models/app-models';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'page-event-settings',
  templateUrl: 'event-settings.html'
})
export class EventSettingsPage {
  event: Event;
  eventFirebaseObject: FirebaseObjectObservable<Event>;
  minDate: string;
  submitted: boolean = false;
  today: Date = new Date();

  constructor(
    af: AngularFire,
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.event = <Event>navParams.get('event');
    this.eventFirebaseObject = af.database.object(`/events/${navParams.get('eventId')}`);
    this.minDate = this.today.toISOString().substring(0,10);
  }

  onEventUpdate(form) {
    let eventData: Event;
    let message = `O Amigo Secreto "${this.event.title}" foi alterado com sucesso.`;
    this.submitted = true;

    if (form.valid) {
      eventData = form.value;

      this.eventFirebaseObject.update(eventData).then(_ => {
        this.events.publish('message:show', message, 'success');
        this.navCtrl.pop();
      });
    }
  }

  removeEvent() {
    let message = `O Amigo Secreto "${this.event.title}" foi removido com sucesso.`;

    this.eventFirebaseObject.remove().then(_ => {
      this.events.publish('message:show', message, 'success');
      this.navCtrl.setRoot(EventListPage);
    });
  }
}
