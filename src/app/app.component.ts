import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform, ToastController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
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
    private keyboard: Keyboard,
    public platform: Platform,
    public splashScreen: SplashScreen,
    private toastCtrl: ToastController,
    public statusBar: StatusBar,
    public userData: UserData
  ) {
    this.initializeApp();
    this.listenToEvents();
    this.isUserLoggedIn();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.keyboard.hideKeyboardAccessoryBar(false);
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

  listenToEvents() {
    this.events.subscribe('user:login', () => {
      this.nav.setRoot(EventListPage);
    });

    this.events.subscribe('message:show', (messageStr, styleClass) => {
      let toast = this.toastCtrl.create({
        message: messageStr,
        cssClass: styleClass,
        duration: 4000,
        position: 'bottom'
      });

      toast.present();
    })
  }
}
