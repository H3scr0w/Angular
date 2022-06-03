export class DropDownType {
  constructor(public value: string = '', public id: string = '') {}
}

export enum RequestActionType {
  Creation = 'C',
  Modification = 'M',
  Deletion = 'A'
}

export enum RequestActionStatus {
  Incoming = 'I',
  MailNotified = 'M',
  Cancelled = 'C'
}
