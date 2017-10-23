import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddParticipantModalPage } from './add-participant-modal';

@NgModule({
  declarations: [
    AddParticipantModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddParticipantModalPage),
  ],
})
export class AddParticipantModalPageModule {}
