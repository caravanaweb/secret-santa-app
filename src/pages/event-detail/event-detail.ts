import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Event, User } from 'api/models/app-models';
import { EventSettingsPage } from '../event-settings/event-settings';
import { AddParticipantModalPage } from "../add-participant-modal/add-participant-modal";
import { ProfilePage } from '../profile/profile';
import { UserData } from '../../providers/user-data';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  eventAttendees: FirebaseListObservable<any>;
  eventFirebaseObject: FirebaseObjectObservable<Event>;
  selectedEvent: Event;
  staticMapImage: string;
  currentUser: User;

  constructor(
    public af: AngularFire,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserData,
    public platform: Platform,
    public launchNavigator: LaunchNavigator
  ) {
    this.eventAttendees = af.database.list(`/eventAttendees/${navParams.get('eventId')}`);
    this.eventFirebaseObject = af.database.object(`/events/${navParams.get('eventId')}`);
    this.eventFirebaseObject.subscribe(snapshot => {
      this.selectedEvent = <Event>snapshot;
    });

    this.staticMapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${this.selectedEvent.location}&zoom=17&size=640x640&markers=${this.selectedEvent.location}&key=AIzaSyAbeCFDXgQbjDU2-usm3rQNF1F3U6zj7Iw`;
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

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  raffleFriends() {
    let index: number;
    let item: string;
    let previousItem: string = '';
    let firstItem: string = '';

    this.af.database.list('/eventAttendees/'+this.selectedEvent.$key, { preserveSnapshot: true })
    .subscribe(snapshots => {
      let friends = [];
      snapshots.forEach(snapshot => {
        friends.push(snapshot.key);
      });

      while(friends.length !== 0) {
        index = this.getRandomInt(0, friends.length-1);
        item = friends[index];

        if (firstItem === '') firstItem = item;
        if (previousItem === '') {
          previousItem = item;
        } else {
          this.updateBestFriend(friends[index], previousItem);
          previousItem = friends[index];
        }

        if (friends.length === 1) {
          this.updateBestFriend(firstItem, friends[index]);
        }

        friends.splice(index, 1);
      }
    });

    this.eventFirebaseObject.update({isRaffleFinished: true})
  }

  updateBestFriend(friend, bestFriend) {
    this.eventAttendees.update(friend, {
      best_friend: bestFriend
    });
  }
}
