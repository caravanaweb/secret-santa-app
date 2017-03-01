import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/statusbar';
import { Splashscreen } from '@ionic-native/splashscreen'

import { EventListPage } from '../pages/event-list/event-list';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class SecretSantaApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = LoginPage;

  constructor(
    public events: Events,
    public platform: Platform
  ) {
    this.initializeApp();
    this.listenToAuthEvents();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleLightContent();
      Splashscreen.hide();
      Keyboard.hideKeyboardAccessoryBar(false);
    });
  }

  listenToAuthEvents() {
    this.events.subscribe('user:login', () => {
      this.nav.setRoot(EventListPage);
    });
  }
}
