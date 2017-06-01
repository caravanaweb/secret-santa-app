import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from "api/models/app-models";
import { UserProvider } from '../../providers/user';
import { FirebaseProvider } from '../../providers/firebase'
import { FirebaseListObservable } from 'angularfire2/database';

import { EventListPage } from '../../pages/event-list/event-list';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  account: User = {};
  submitted: boolean = false;
  users: FirebaseListObservable<User[]>;

  constructor(
    public firebaseProvider: FirebaseProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {
    let firebaseUser = navParams.get('firebaseUser');
    this.account = {
      'uid': firebaseUser.uid,
      'name': firebaseUser.displayName,
      'email': firebaseUser.email,
      'picture': firebaseUser.photoURL
    }
    this.users = firebaseProvider.getList('/users');
  }

  onAccountCreate(form) {
    this.submitted = true;
    let accountData: User;

    if (form.valid) {
      accountData = this.account;
      let userKey: string = this.users.push(accountData).key;
      accountData.$key = userKey;
      this.userProvider.setProfile(JSON.stringify(accountData)).then(_ => {
        this.navCtrl.setRoot(EventListPage);
      });
    }
  }
}
