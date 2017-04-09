declare module 'api/models/app-models' {
  interface Event {
    $key?: string;
    title?: string;
    picture?: string;
    friends?: number;
    raffleDate?: string;
    eventDate?: string;
    eventTime?: string;
    location?: string;
    ownership?: string;
    isFriendsChosen?: boolean;
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
