import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Page } from '../../models/page.model';
import { TenantAccountModel } from '../../models/tenant-account.model';

export interface ITenantAccountService {
  getAllTenantAccounts(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    label?: string
  ): Observable<Page<TenantAccountModel>>;
}

@Injectable({
  providedIn: 'root'
})
export class TenantAccountService implements ITenantAccountService {
  private url = '/tenant-accounts';

  constructor(private http: HttpClient) {}

  getAllTenantAccounts(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    label?: string
  ): Observable<Page<TenantAccountModel>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }
    if (label) {
      params = params.set('label', label);
    }

    return this.http.get<Page<TenantAccountModel>>(this.url, { params });
  }
}
