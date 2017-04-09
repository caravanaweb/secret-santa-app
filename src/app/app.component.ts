import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthService } from '../providers/auth-service';
import { AngularFire } from 'angularfire2';
import { UserData } from '../providers/user-data';

import { EventListPage } from '../pages/event-list/event-list';
import { LoginPage } from '../pages/login/login';
import { AccountPage } from '../pages/account/account';

@Component({
  templateUrl: 'app.html'
})
export class SecretSantaApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: Component;

  constructor(
    public af: AngularFire,
    public authService: AuthService,
    public events: Events,
    private keyboard: Keyboard,
    public platform: Platform,
    public splashScreen: SplashScreen,
    private toastCtrl: ToastController,
    public statusBar: StatusBar,
    public storage: Storage,
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
        const queryObservable = this.af.database.list('/users', {
          preserveSnapshot: true,
          query: {
            orderByChild: 'uid',
            equalTo: auth$.uid
          }
        });

        queryObservable.subscribe(queriedItems => {
          if (queriedItems.length > 0) {
            queriedItems.forEach(snapshot => {
              let user: any = snapshot.val();
              user.$key = snapshot.key;
              this.userData.setProfile(JSON.stringify(user));
              this.userData.setProfileId(auth$.uid);
              this.nav.setRoot(EventListPage);
            });
          } else {
            this.userData.setProfileId(auth$.uid);
            this.nav.setRoot(AccountPage, { 'auth': auth$ });
          }
        });
      } else {
        this.rootPage = LoginPage;
      }
    });
  }

  listenToEvents() {
    this.events.subscribe('user:login', (fireData) => {
    });

    this.events.subscribe('user:logout', _ => {
      this.storage.clear();
      this.authService.signOut();
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
