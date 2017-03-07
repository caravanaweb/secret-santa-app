declare module 'api/models/app-models' {
  interface Event {
    id?: string;
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
