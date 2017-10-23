import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { Facebook } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/camera';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Calendar } from '@ionic-native/calendar';
import { IonicStorageModule } from '@ionic/storage';
import { SecretSantaApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { FirebaseProvider } from '../providers/firebase';
import { AuthProvider } from '../providers/auth';
import { UserProvider } from '../providers/user';
import { EventProvider } from '../providers/event';

export const firebaseConfig = {
  apiKey: "AIzaSyCpGM7VQ6g6WuGvpukqQlIkd9Q12sD2kPU",
  authDomain: "secret-santa-1481683764948.firebaseapp.com",
  databaseURL: "https://secret-santa-1481683764948.firebaseio.com",
  projectId: "secret-santa-1481683764948",
  storageBucket: "secret-santa-1481683764948.appspot.com",
  messagingSenderId: "56975771687"
};

let pages = [
  SecretSantaApp
];

export function providers() {
  return [
    AuthProvider,
    Camera,
    Facebook,
    Keyboard,
    SplashScreen,
    StatusBar,
    UserProvider,
    EventProvider,
    LaunchNavigator,
    Calendar,
    FirebaseProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: pages,
  imports: [
    BrowserModule,
    IonicModule.forRoot(SecretSantaApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers: providers()
})
export class AppModule {}
