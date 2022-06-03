import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessRight } from '../models/access-right.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class AccessRightService {
  private url = '/accessrights';

  constructor(private http: HttpClient) {}

  getAccessRights(index?: number, size?: number): Observable<Page<AccessRight>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.get<Page<AccessRight>>(this.url, { params });
  }

  deleteAccessRight(id: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + id);
  }

  createOrUpdateAccessRight(id: number, right: AccessRight): Observable<AccessRight> {
    return this.http.put<AccessRight>(this.url + '/' + id, right);
  }
}
