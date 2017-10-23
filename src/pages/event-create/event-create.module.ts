import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCreatePage } from './event-create';

@NgModule({
  declarations: [
    EventCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(EventCreatePage),
  ],
})
export class EventCreatePageModule {}
