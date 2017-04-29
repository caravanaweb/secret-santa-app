import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams, Platform } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Event, User } from "api/models/app-models";
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Camera } from '@ionic-native/camera';

import { UserData } from '../../providers/user-data';
import { EventData } from '../../providers/event-data';
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
    public af: AngularFire,
    public camera: Camera,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public sanitizer: DomSanitizer,
    public userData: UserData,
    public eventData: EventData,
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
    let fireStorage: Promise<any>;

    if (form.valid) {
      eventData = this.event;
      eventData.ownership = this.currentUser.uid;
      eventKey = this.events.push(eventData).key;

      if (this.eventPicture && Camera['installed']()) {
        fireStorage = this.eventData.uploadEventPicture(eventKey, this.eventPicture, 'base64');
      } else {
        fireStorage = this.eventData.uploadEventPicture(eventKey, this.eventPicture);
      }

      fireStorage.then(snapshot => {
        this.eventData.updateEventPicture(eventKey, snapshot.downloadURL).then(_ => {
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
    let input = this.fileInput.nativeElement;

    var reader = new FileReader();
    reader.onload = (readerEvent) => {
      var imageData = (readerEvent.target as any).result;
      this.eventPicture = event.target.files[0];
      this.base64Image = imageData;
    };

    reader.readAsDataURL(event.target.files[0]);
  }
}
