import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SecretSantaApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

let pages = [
  SecretSantaApp,
  HomePage,
  LoginPage
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: declarations(),
  imports: [
    IonicModule.forRoot(SecretSantaApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule {}
