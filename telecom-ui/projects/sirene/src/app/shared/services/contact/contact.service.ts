import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Contact, ContactFilter } from '../../models/contact';
import { Page } from '../../models/page.model';

export interface IContactService {
  getAllContacts(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    contactFilter?: ContactFilter
  ): Observable<Page<Contact>>;
  getContactById(id: number): Observable<Contact>;
  getContactByCountry(country: string): Observable<Contact>;
  addContact(contact: Contact): Observable<Contact>;
  editContact(contact: Contact): Observable<Contact>;
  deleteContact(id: number): Observable<Contact>;
  recoverContact(contact: Contact): Observable<Contact>;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService implements IContactService {
  private url = '/common/users';

  constructor(private http: HttpClient) {}

  getAllContacts(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    contactFilter?: ContactFilter
  ): Observable<Page<Contact>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    } else if (contactFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');

      if (contactFilter.profile) {
        params = params.set('profile', '' + contactFilter.profile.name.trim());
      }

      if (contactFilter.firstName) {
        params = params.set('firstName', '' + contactFilter.firstName.trim());
      }
      if (contactFilter.name) {
        params = params.set('lastName', '' + contactFilter.name.trim());
      }
      if (contactFilter.email) {
        params = params.set('email', '' + contactFilter.email.trim());
      }
      if (contactFilter.showArchived) {
        params = params.set('showArchived', '' + contactFilter.showArchived);
      }
      if (contactFilter.countrySupervised) {
        params = params.set('countrySupervised', '' + contactFilter.countrySupervised.trim());
      }
    }

    return this.http.get<Page<Contact>>(this.url, { params });
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(this.url + '/' + id);
  }

  getContactByCountry(country: string): Observable<Contact> {
    return this.http.get<Contact>(this.url + '/rsm/countries/' + country);
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.url, contact);
  }

  editContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(this.url + '/' + contact.id, contact);
  }

  deleteContact(id: number): Observable<Contact> {
    return this.http.delete<Contact>(this.url + '/' + id);
  }

  recoverContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(this.url + '/recover/' + contact.id, contact);
  }
}
