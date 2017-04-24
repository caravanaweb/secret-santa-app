import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { Event, User } from 'api/models/app-models';
import { EventSettingsPage } from '../event-settings/event-settings';
import { AddParticipantModalPage } from "../add-participant-modal/add-participant-modal";
import { ProfilePage } from '../profile/profile';
import { UserData } from '../../providers/user-data';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  eventAttendees: FirebaseListObservable<any>;
  selectedEvent: Event;
  staticMapImage: string;
  currentUser: User;

  constructor(
    public af: AngularFire,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserData
  ) {
    this.selectedEvent = <Event>navParams.get('event');
    this.eventAttendees = this.af.database.list(`/eventAttendees/${this.selectedEvent.$key}`);

    this.staticMapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${this.selectedEvent.location}&zoom=17&size=640x640&markers=${this.selectedEvent.location}&key=AIzaSyAbeCFDXgQbjDU2-usm3rQNF1F3U6zj7Iw`;
  }

  ngAfterViewInit() {
    this.getProfile();
  }

  getDirections() {
    window.open(`https://maps.google.com/?q=${this.selectedEvent.location}`, '_system');
  }

  getProfile() {
    this.userData.getProfile().then((currentUser) => {
      this.currentUser = JSON.parse(currentUser);
    });
  }

  goToProfile(userKey) {
    if (userKey !== this.currentUser.$key) {
      this.navCtrl.push(ProfilePage, {'userKey':userKey});
    }
  }

  pushToEventSettingsPage() {
    this.navCtrl.push(EventSettingsPage, {
      'eventId': this.selectedEvent.$key,
      'event': this.selectedEvent
    });
  }

  openAddParticipantModal() {
    let addParticipantModal = this.modalCtrl.create(AddParticipantModalPage, {eventId: this.selectedEvent.$key});
    addParticipantModal.present();
  }
}
