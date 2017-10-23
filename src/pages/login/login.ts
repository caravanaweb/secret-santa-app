import { Component } from '@angular/core';
import { Events, NavController, NavParams, IonicPage } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  isLoading: boolean;

  constructor(
    private _auth: AuthProvider,
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  private onSignInSuccess(): void {
    this.isLoading = false;
  }

  connectWithFacebook(): void {
    this.isLoading = true;

    this._auth.signInWithFacebook()
      .then(() => this.onSignInSuccess())
      .catch(() => {
        this.isLoading = false;
      })
  }
}
