import { Contact } from '../../../shared/models/contact';

export interface ContactDialogData {
  mode: string;
  contact: Contact;
  role: string;
  isContactRequested: boolean;
  isContactAlreadyRequested: boolean;
}
