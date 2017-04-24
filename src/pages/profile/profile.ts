import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { User } from 'api/models/app-models';
import { UserData } from '../../providers/user-data';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  @ViewChild(Content) content: Content
  currentUser: User;
  recommendation: String;
  recommendationList: any[];
  recommendations: FirebaseListObservable<any>;
  userFireObject: FirebaseObjectObservable<User>;

  constructor(
    af: AngularFire,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserData
  ) {
    this.userFireObject = af.database.object(`/users/${navParams.get('userKey')}`);
    this.recommendations = af.database.list(`/recommendations/${navParams.get('userKey')}`);

    this.recommendations.subscribe(snapshots => {
      let recommendations = [];
      snapshots.forEach(snapshot => {
        recommendations.push(snapshot);
      });

      this.recommendationList = recommendations;
    });
  }

  ngAfterViewInit() {
    this.userData.getProfile().then((currentUser) => {
      this.currentUser = JSON.parse(currentUser);
    });
  }

  onAddRecommendation(inputFriendFeedback):void {
    let userKey: String = this.currentUser.$key

    if (inputFriendFeedback) {
      this.recommendations.push({
        'userKey': userKey,
        'text': inputFriendFeedback.value
      }).then(_ => {
        this.recommendation = '';
        this.scrollToBottom();
      });
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(0);
  }
}
