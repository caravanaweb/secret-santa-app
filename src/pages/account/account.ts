import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { User } from "api/models/app-models";
import { UserProvider } from '../../providers/user';
import { FirebaseProvider } from '../../providers/firebase';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  account: User = {};
  submitted: boolean = false;
  createdAccount: AngularFirestoreDocument<User>;

  constructor(
    public firebaseProvider: FirebaseProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {
    let firebaseUser = navParams.get('authenticatedUser');
    
    this.account = {
      'uid': firebaseUser.uid,
      'name': firebaseUser.displayName,
      'email': firebaseUser.email,
      'picture': firebaseUser.photoURL
    }
  }

  async onAccountCreate(form) {
    this.submitted = true;
    let accountData: User;

    if (form.valid) {
      accountData = this.account;
      const createdAccount: any = await this.firebaseProvider.addItem('/users', accountData);
      accountData.$key = createdAccount.id;
      
      await this.userProvider.setProfile(JSON.stringify(accountData));
      this.navCtrl.setRoot('EventListPage');
    }
  }
}
