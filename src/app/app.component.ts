import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth';
import { UserProvider } from '../providers/user';
import { FirebaseProvider } from '../providers/firebase';

@Component({
  templateUrl: 'app.html'
})
export class SecretSantaApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(
    public afAuth: AngularFireAuth,
    private authProvider: AuthProvider,
    public events: Events,
    private keyboard: Keyboard,
    public platform: Platform,
    public splashScreen: SplashScreen,
    private toastCtrl: ToastController,
    public statusBar: StatusBar,
    public storage: Storage,
    public userProvider: UserProvider,
    public firebaseProvider: FirebaseProvider
  ) {
    this.isUserLoggedIn();
    this.initializeApp();
    this.listenToEvents();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.keyboard.hideKeyboardAccessoryBar(false);
    });
  }

  isUserLoggedIn() {
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.nav.setRoot('LoginPage');
      } else {
        this.userProvider.checkUserAccount(user).subscribe(queriedItems => {
          if (queriedItems.length > 0) {
            queriedItems.forEach(snapshot => {
              let user: any;
              let userObservable: any = this.firebaseProvider.getObject(snapshot.payload.doc.ref.path).valueChanges();

              userObservable.subscribe(userData => {
                user = userData;
                user.$key = snapshot.payload.doc.id;

                this.userProvider.setProfile(JSON.stringify(user)).then(_ => {
                  this.nav.setRoot('EventListPage');
                });
              });
            });
          } else {
            this.nav.setRoot('AccountPage', { 'authenticatedUser': user });
          }
        });
      }
    });
  }

  listenToEvents() {
    this.events.subscribe('user:logout', _ => {
      this.storage.clear();
      this.authProvider.signOut().then(_ => {
        this.nav.setRoot('LoginPage');
      });
    });

    this.events.subscribe('message:show', (messageStr, styleClass) => {
      let toast = this.toastCtrl.create({
        message: messageStr,
        cssClass: styleClass,
        duration: 4000,
        position: 'bottom'
      });

      toast.present();
    });
  }
}
