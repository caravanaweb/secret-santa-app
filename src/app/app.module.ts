import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SecretSantaApp } from './app.component';
import { Storage } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../providers/auth-service';
import { UserData } from '../providers/user-data';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { EventListPage } from '../pages/event-list/event-list';
import { EventCreatePage } from '../pages/event-create/event-create';
import { EventDetailPage } from '../pages/event-detail/event-detail';

export const firebaseConfig = {
  // Inclua as informações que você copiou do console do Firebase.
};

let pages = [
  SecretSantaApp,
  HomePage,
  LoginPage,
  EventCreatePage,
  EventListPage,
  EventDetailPage
];

export function providers() {
  return [
    AuthService,
    Storage,
    UserData,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: pages,
  imports: [
    IonicModule.forRoot(SecretSantaApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers: providers()
})
export class AppModule {}
