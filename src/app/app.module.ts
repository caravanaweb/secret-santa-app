import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SecretSantaApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../providers/auth-service';
import { UserData } from '../providers/user-data';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { EventListPage } from '../pages/event-list/event-list';
import { EventCreatePage } from '../pages/event-create/event-create';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { EventSettingsPage } from '../pages/event-settings/event-settings';

export const firebaseConfig = {
  // Inclua as informações que você copiou do console do Firebase.
};

let pages = [
  SecretSantaApp,
  HomePage,
  LoginPage,
  EventCreatePage,
  EventListPage,
  EventDetailPage,
  EventSettingsPage
];

export function providers() {
  return [
    AuthService,
    Keyboard,
    SplashScreen,
    StatusBar,
    UserData,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: pages,
  imports: [
    IonicModule.forRoot(SecretSantaApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers: providers()
})
export class AppModule {}
