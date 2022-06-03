import { ServerRecord } from './server-record.model';
import { User } from './user.model';

export class WebAppAuthRecord {
  id: number;
  name: string;
  serverRecord: ServerRecord;
  owner: User;
  createdDate: Date;
  updatedDate: Date;
}
