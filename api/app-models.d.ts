declare module 'api/models/app-models' {
  interface Event {
    id?: string;
    title?: string;
    picture?: string;
    friends?: number;
    raffleDate?: Date;
    eventDate?: string;
    location?: string;
    ownership?: string;
    isFriendsChosen?: boolean;
  }
}
