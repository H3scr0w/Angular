import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { MailingList } from '../../models/mailing-list';
import { Page } from '../../models/page.model';

export interface IMailingListService {
  getAllMailingList(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<MailingList>>;

  updateMailingList(mailingList: MailingList): Observable<MailingList>;

  saveMailingList(mailingList: MailingList): Observable<MailingList>;
}

@Injectable({
  providedIn: 'root'
})
export class MailingListService implements IMailingListService {
  private url = '/mailing-lists';

  constructor(private http: HttpClient) {}

  getAllMailingList(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<MailingList>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<MailingList>>(this.url, { params });
  }

  updateMailingList(mailingList: MailingList): Observable<MailingList> {
    return this.http.put<MailingList>(this.url, mailingList);
  }

  saveMailingList(mailingList: MailingList): Observable<MailingList> {
    return this.http.post<MailingList>(this.url, mailingList);
  }
}
