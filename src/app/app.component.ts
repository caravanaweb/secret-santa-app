import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/statusbar';
import { Splashscreen } from '@ionic-native/splashscreen'
import { AuthService } from '../providers/auth-service';
import { AngularFire } from 'angularfire2';
import { UserData } from '../providers/user-data';

import { EventListPage } from '../pages/event-list/event-list';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class SecretSantaApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: Component;

  constructor(
    public af: AngularFire,
    public events: Events,
    public platform: Platform,
    public userData: UserData
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
    this.af.auth.subscribe(auth$ => {
      if (auth$) {
        this.userData.setProfileId(auth$.uid);
        this.rootPage = EventListPage;
      } else {
        this.rootPage = LoginPage;
      }
    });
  }

  listenToAuthEvents() {
    this.events.subscribe('user:login', () => {
      this.nav.setRoot(EventListPage);
    });
  }
}
