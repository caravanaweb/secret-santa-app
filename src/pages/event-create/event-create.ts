import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams, Platform, IonicPage } from 'ionic-angular';
import { Event, User } from "api/models/app-models";
import { FirebaseProvider } from '../../providers/firebase';
import { Observable } from 'rxjs/Observable';
import { Camera } from '@ionic-native/camera';
import { Calendar } from '@ionic-native/calendar';

import { UserProvider } from '../../providers/user';
import { EventProvider } from '../../providers/event';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html'
})
export class EventCreatePage {
  @ViewChild('fileInput') fileInput;
  event: Event = {};
  events: Observable<Event[]>;
  minDate: string;
  minEventDate: string;
  today: Date;
  submitted: boolean = false;
  currentUser: User;
  eventPicture: any;
  base64Image: any;

  constructor(
    public firebaseProvider: FirebaseProvider,
    public camera: Camera,
    public calendar: Calendar,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public userProvider: UserProvider,
    public eventProvider: EventProvider,
    public utilEvents: Events
  ) {
    this.today = new Date();
    this.minDate = this.today.toISOString().substring(0,10);
    this.event.raffleDate = this.minDate;
    this.events = firebaseProvider.getList('/events').valueChanges();
  }

  ngAfterViewInit() {
    this.userProvider.getProfile().then(profile => {
      this.currentUser = JSON.parse(profile);
    });
  }

  onRaffleDateAccept(event) {
    this.minEventDate = new Date(event.year, event.month-1, event.day).toISOString().substring(0,10);
  }

  async addAdminToEvent(eventId) {
    let user = this.currentUser;
    const attendeeData: any = {
      name: user.name,
      gift: user.gift,
      picture: user.picture,
      admin: true
    }

    await this.firebaseProvider.addItem(`/events/${eventId}/attendees`,attendeeData);
  }

  toDateTime(dateStr, timeStr) {
    let dateParts = dateStr.split('-');
    let timeParts = timeStr.split(':');
    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1]);
  }

  addToCalendar(event) {
    let eventDateTime = this.toDateTime(event.eventDate, event.eventTime);
    let eventNotes = `O sorteio será realizado no dia ${event.raffleDate}`;
    let endDateTime = eventDateTime;
    endDateTime.setHours(endDateTime.getHours()+3);

    this.calendar.createEvent(event.title, event.location, eventNotes, eventDateTime, endDateTime);
  }

  async onEventCreate(form) {
    let eventData: Event;
    let fireStorage: Promise<any>;

    if (form.valid) {
      this.submitted = true;
      eventData = this.event;
      eventData.eventDate = new Date(`${this.event.eventDate}T${this.event.eventTime}`);
      eventData.ownership = this.currentUser.$key;
      eventData.timestamp = firebase.firestore.FieldValue.serverTimestamp();
      
      let eventRef = await this.firebaseProvider.addItem('/events', eventData);
      await this.addAdminToEvent(eventRef.id);
      
      if (form.value.saveOnCalendar) {
        this.addToCalendar(eventData);
      }

      if (this.eventPicture && Camera['installed']()) {
        fireStorage = this.eventProvider.uploadEventPicture(eventRef.id, this.eventPicture, 'base64');
      } else {
        fireStorage = this.eventProvider.uploadEventPicture(eventRef.id, this.eventPicture);
      }

      fireStorage.then(snapshot => {
        this.firebaseProvider.updateItem(`/events/${eventRef.id}`,{'picture': snapshot.downloadURL});
        this.utilEvents.publish('message:show', `O Amigo Secreto "${this.event.title}" foi criado com sucesso.`, 'success');
        this.navCtrl.setRoot('EventListPage');
      });
    }
  }

  grabEventPicture(): void {
    if (Camera['installed']()) {
      //cordova-plugin-camera https://ionicframework.com/docs/native/camera/
      this.camera.getPicture({
        quality : 95,
        destinationType : this.camera.DestinationType.DATA_URL,
        sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit : true,
        encodingType: this.camera.EncodingType.PNG,
        targetWidth: 500,
        targetHeight: 500
      }).then(imageData => {
        this.eventPicture = imageData;
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
      }, error => {
        console.log('ERROR -> ' + JSON.stringify(error));
      });
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    var reader = new FileReader();
    reader.onload = (readerEvent) => {
      var imageData = (readerEvent.target as any).result;
      this.eventPicture = event.target.files[0];
      this.base64Image = imageData;
    };

    reader.readAsDataURL(event.target.files[0]);
  }
}
