export class Notification {
  NotifID: string;     // CHAR(8)
  Type: string;        // VARCHAR(50)
  Content: string;     // TEXT
  Date: Date;          // DATETIME
  Status: 'Seen' | 'Unseen'; // ENUM
  UserID: string;      // CHAR(8)
}
