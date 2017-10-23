import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase';
import { Observable } from 'rxjs/Observable';
import { User } from 'api/models/app-models';

@IonicPage()
@Component({
  selector: 'page-add-participant-modal',
  templateUrl: 'add-participant-modal.html'
})
export class AddParticipantModalPage {
  isUserListVisible: boolean;
  users: Observable<User[]>;
  usersCount: number;
  userList: User[];
  loadedUserList: User[];
  eventAttendees: Observable<User[]>;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public firebaseProvider: FirebaseProvider
  ) {}

  ngOnInit() {
    this.eventAttendees = this.firebaseProvider.getList(`/events/${this.navParams.get('id')}/attendees`).valueChanges();
    this.users = this.firebaseProvider.afs.collection('/users', ref => {
      return ref.orderBy('name');
    }).valueChanges();
  }

  addParticipant(user):void {
    console.log(user, '@TODO: should add participants');
    
    // this.eventAttendees.update(user.$key, {
    //   name: user.name,
    //   gift: user.gift,
    //   picture: user.picture
    // }).then(_ => {
    //   this.isUserListVisible = false;
    // });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  removeParticipant(user): void {
    console.log(user, '@TODO: should remove participants');
    // let message = `Você acaba de remover "${user.name}" do seu Amigo Secreto com sucesso.`;

    // this.firebaseProvider.removeItem(`/events/${this.navParams.get('id')}/attendees`, user.$key).then(_ => {
    //   this.events.publish('message:show', message, 'success');
    // });
  }
}
