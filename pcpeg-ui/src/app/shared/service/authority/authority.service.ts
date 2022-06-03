import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs/internal/Observable';
import { AuthorityModel } from '../../models/authority.model';
import { Page } from '../../models/page.model';

export interface IAuthorityService {
  getCompanyAuthoritySettings(
    societeSid: number,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<AuthorityModel>>;

  createOrUpdateCompanyAuthoritySetting(societeSid: number, authority: AuthorityModel): Observable<AuthorityModel>;

  deleteCompanyAuthoritySetting(authorityId: number, societeSid: number): Observable<void>;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorityService implements IAuthorityService {
  private url = '/authority-settings';

  constructor(private http: HttpClient) {}

  getCompanyAuthoritySettings(
    societeSid: number,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<AuthorityModel>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    return this.http.get<Page<AuthorityModel>>(this.url + `/companies/${societeSid}`, { params });
  }

  createOrUpdateCompanyAuthoritySetting(societeSid: number, authority: AuthorityModel): Observable<AuthorityModel> {
    return this.http.post<AuthorityModel>(this.url + `/companies/${societeSid}`, authority);
  }

  deleteCompanyAuthoritySetting(authorityId: number, societeSid: number): Observable<void> {
    return this.http.delete<void>(this.url + `/${authorityId}/companies/${societeSid}`);
  }
}
