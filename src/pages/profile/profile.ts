import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { User } from 'api/models/app-models';
import { UserProvider } from '../../providers/user';
import { FirebaseProvider } from '../../providers/firebase'
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

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
    public firebaseProvider: FirebaseProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {
    this.userFireObject = firebaseProvider.getObject(`/users/${navParams.get('userKey')}`);
    this.recommendations = firebaseProvider.getList(`/recommendations/${navParams.get('userKey')}`);

    this.recommendations.subscribe(snapshots => {
      let recommendations = [];
      snapshots.forEach(snapshot => {
        recommendations.push(snapshot);
      });

      this.recommendationList = recommendations;
    });
  }

  ngAfterViewInit() {
    this.userProvider.getProfile().then((currentUser) => {
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
