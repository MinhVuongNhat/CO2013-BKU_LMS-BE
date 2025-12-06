export class Notification {
  NotifID: string;
  Type: string;
  Content: string;
  Date: Date;
  Status: 'Seen' | 'Unseen';
  UserID: string;
}
