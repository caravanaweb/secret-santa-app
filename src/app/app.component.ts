import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/statusbar';
import { Splashscreen } from '@ionic-native/splashscreen'

import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class SecretSantaApp {
  rootPage = LoginPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
