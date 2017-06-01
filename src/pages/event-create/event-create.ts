import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Event, User } from "api/models/app-models";
import { FirebaseProvider } from '../../providers/firebase'
import { FirebaseListObservable } from 'angularfire2/database';
import { Camera } from '@ionic-native/camera';
import { Calendar } from '@ionic-native/calendar';

import { UserProvider } from '../../providers/user';
import { EventProvider } from '../../providers/event';
import { EventListPage } from '../../pages/event-list/event-list';

@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html'
})
export class EventCreatePage {
  @ViewChild('fileInput') fileInput;
  event: Event = {};
  events: FirebaseListObservable<Event>;
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
    public sanitizer: DomSanitizer,
    public userProvider: UserProvider,
    public eventProvider: EventProvider,
    public utilEvents: Events
  ) {
    this.today = new Date();
    this.minDate = this.today.toISOString().substring(0,10);
    this.event.raffleDate = this.minDate;
    this.events = firebaseProvider.getList('/events');
  }

  ngAfterViewInit() {
    this.userProvider.getProfile().then(profile => {
      this.currentUser = JSON.parse(profile);
    });
  }

  onRaffleDateAccept(event) {
    this.minEventDate = new Date(event.year, event.month-1, event.day).toISOString().substring(0,10);
  }

  addAdminToEvent(eventId) {
    let eventAttendees: any;
    let user = this.currentUser;

    eventAttendees = this.firebaseProvider.getList(`/eventAttendees/${eventId}`);
    return eventAttendees.update(user.$key, {
      name: user.name,
      gift: user.gift,
      picture: user.picture,
      admin: true
    });
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

  onEventCreate(form) {
    this.submitted = true;
    let eventData: Event;
    let eventKey: string;
    let fireStorage: Promise<any>;

    if (form.valid) {
      eventData = this.event;
      eventData.ownership = this.currentUser.uid;
      eventKey = this.events.push(eventData).key;

      if (form.value.saveOnCalendar) {
        this.addToCalendar(eventData);
      }

      if (this.eventPicture && Camera['installed']()) {
        fireStorage = this.eventProvider.uploadEventPicture(eventKey, this.eventPicture, 'base64');
      } else {
        fireStorage = this.eventProvider.uploadEventPicture(eventKey, this.eventPicture);
      }

      fireStorage.then(snapshot => {
        this.eventProvider.updateEventPicture(eventKey, snapshot.downloadURL).then(_ => {
          this.addAdminToEvent(eventKey).then(_ => {
            this.utilEvents.publish('message:show', `O Amigo Secreto "${this.event.title}" foi criado com sucesso.`, 'success');
            this.navCtrl.push(EventListPage);
          });
        });
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
