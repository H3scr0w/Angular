import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Contact, ContactFilter } from '../../models/contact';
import { Page } from '../../models/page.model';
import { IContactService } from './contact.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockContactService implements IContactService {
  getAllContacts(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    contactFilter?: ContactFilter
  ): Observable<Page<Contact>> {
    return of(null);
  }

  getContactById(id: number): Observable<Contact> {
    throw new Error('Method not implemented.');
  }
  addContact(contact: Contact): Observable<Contact> {
    throw new Error('Method not implemented.');
  }
  editContact(contact: Contact): Observable<Contact> {
    throw new Error('Method not implemented.');
  }
  deleteContact(id: number): Observable<Contact> {
    throw new Error('Method not implemented.');
  }
  recoverContact(contact: Contact): Observable<Contact> {
    throw new Error('Method not implemented.');
  }

  getContactByCountry(country: string): Observable<Contact> {
    throw new Error('Method not implemented.');
  }
}
