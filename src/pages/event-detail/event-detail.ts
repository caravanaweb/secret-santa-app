import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, Platform, IonicPage } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Event, User } from 'api/models/app-models';
import { UserProvider } from '../../providers/user';
import { FirebaseProvider } from '../../providers/firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';

@IonicPage({
  segment: 'event/:id',
  defaultHistory: ['EventListPage']
})
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  eventAttendees: Observable<any[]>;
  eventFirebaseObject: Observable<Event>;
  selectedEvent: Event;
  staticMapImage: string;
  currentUser: User;

  constructor(
    public firebaseProvider: FirebaseProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public platform: Platform,
    public launchNavigator: LaunchNavigator
  ) {
    this.eventAttendees = firebaseProvider.getList(`/events/${navParams.get('id')}/attendees`).valueChanges();
    this.eventFirebaseObject = firebaseProvider.getObject(`/events/${navParams.get('id')}`).valueChanges();
    let eventSubscription = this.eventFirebaseObject.subscribe(snapshot => {
      this.selectedEvent = <Event>snapshot;
      this.selectedEvent.id = navParams.get('id');
      this.staticMapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${this.selectedEvent.location}&zoom=17&size=640x640&markers=${this.selectedEvent.location}&key=AIzaSyAbeCFDXgQbjDU2-usm3rQNF1F3U6zj7Iw`;
      eventSubscription.unsubscribe();
    });
  }

  ngAfterViewInit() {
    this.getProfile();
  }

  getDirections() {
    if (this.platform.is('mobileweb') || this.platform.is('core')) {
      window.open(`https://maps.google.com/?q=${this.selectedEvent.location}`, '_system');
    } else {
      //https://ionicframework.com/docs/native/launch-navigator/
      this.launchNavigator.navigate(this.selectedEvent.location);
    }
  }

  getProfile() {
    this.userProvider.getProfile().then((currentUser) => {
      this.currentUser = JSON.parse(currentUser);
    });
  }

  goToProfile(userKey) {
    if (userKey !== this.currentUser.$key) {
      this.navCtrl.push('ProfilePage', {'userKey':userKey});
    }
  }

  goToEventSettingsPage() {
    this.navCtrl.push('EventSettingsPage', {
      'id': this.selectedEvent.id
    });
  }

  openAddParticipantModal() {
    let addParticipantModal = this.modalCtrl.create('AddParticipantModalPage', {id: this.selectedEvent.id});
    addParticipantModal.present();
  }
}
