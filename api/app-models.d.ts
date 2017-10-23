declare module 'api/models/app-models' {
  interface Event {
    id?: string;
    $key?: string;
    title?: string;
    picture?: string;
    friends?: number;
    raffleDate?: string;
    eventDate?: Date;
    eventTime?: string;
    location?: string;
    ownership?: string;
    isFriendsChosen?: boolean;
    timestamp?: any;
  }

  interface User {
    $key?: string;
    uid?: string;
    name?: string;
    username?: string;
    email?: string;
    picture?: string;
    gift?: string;
    phone?: string;
    birthday?: Date;
  }
}
