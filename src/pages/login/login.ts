import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  isLoading: boolean;

  constructor(
    private _auth: AuthService,
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
