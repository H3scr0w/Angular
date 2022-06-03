import { Fields } from './util/fields.model';
import { WebAppAuthServerRecordField } from './webappauth-serverrecord-field.model';

export class ServerRecord {
  type: string;
  sslOnly: boolean;
  fields: Fields<WebAppAuthServerRecordField>;
}
