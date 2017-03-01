import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/statusbar';
import { Splashscreen } from '@ionic-native/splashscreen'
import { AuthService } from '../providers/auth-service';

import { EventListPage } from '../pages/event-list/event-list';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class SecretSantaApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: Component;

  constructor(
    public _auth: AuthService,
    public events: Events,
    public platform: Platform
  ) {
    this.initializeApp();
    this.listenToAuthEvents();
    this.isUserLoggedIn();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleLightContent();
      Splashscreen.hide();
      Keyboard.hideKeyboardAccessoryBar(false);
    });
  }

  isUserLoggedIn() {
    if (this._auth.authenticated) {
      this.rootPage = EventListPage
    } else {
      this.rootPage = LoginPage;
    }
  }

  listenToAuthEvents() {
    this.events.subscribe('user:login', () => {
      this.nav.setRoot(EventListPage);
    });
  }
}
