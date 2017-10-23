import { Component } from '@angular/core';
import { Events, NavController, NavParams, IonicPage } from 'ionic-angular';
import { Event } from 'api/models/app-models';
import { FirebaseProvider } from '../../providers/firebase';
import { AngularFirestoreDocument } from 'angularfire2/firestore';

@IonicPage({
  segment: 'event/:id/edit'
})
@Component({
  selector: 'page-event-settings',
  templateUrl: 'event-settings.html'
})
export class EventSettingsPage {
  event: Event;
  eventFirebaseDocument: AngularFirestoreDocument<Event>;
  minDate: string;
  submitted: boolean = false;
  today: Date = new Date();

  constructor(
    public firebaseProvider: FirebaseProvider,
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.eventFirebaseDocument = firebaseProvider.getObject(`/events/${navParams.get('id')}`);
    let eventSubscription = this.eventFirebaseDocument.valueChanges().subscribe(snapshot => {
      this.event = <Event>snapshot;
      this.event.id = navParams.get('id');
      eventSubscription.unsubscribe();
    });
    this.minDate = this.today.toISOString().substring(0,10);
  }

  async onEventUpdate(form) {
    let eventData: Event;
    let message = `O Amigo Secreto "${this.event.title}" foi alterado com sucesso.`;
    this.submitted = true;

    if (form.valid) {
      eventData = form.value;

      await this.eventFirebaseDocument.update(eventData);
      this.events.publish('message:show', message, 'success');
      this.navCtrl.setRoot('EventListPage');
    }
  }

  async removeEvent() {
    let message = `O Amigo Secreto "${this.event.title}" foi removido com sucesso.`;

    await this.eventFirebaseDocument.delete();
    this.events.publish('message:show', message, 'success');
    this.navCtrl.setRoot('EventListPage');
  }
}
