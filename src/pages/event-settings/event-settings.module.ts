import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventSettingsPage } from './event-settings';

@NgModule({
  declarations: [
    EventSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventSettingsPage),
  ],
})
export class EventSettingsPageModule {}
