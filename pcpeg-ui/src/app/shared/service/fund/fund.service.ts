import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Page } from '../../models/page.model';
import { FundModel } from './../../models/fund.model';

export interface IFundService {
  getAllFunds(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    label?: string,
    groups?: string[],
    isActive?: boolean
  ): Observable<Page<FundModel>>;

  downloadFunds(): Observable<Blob>;

  createFund(fund: FundModel): Observable<FundModel>;

  updateFund(fund: FundModel): Observable<FundModel>;
}

@Injectable({
  providedIn: 'root'
})
export class FundService implements IFundService {
  private url = '/funds';

  constructor(private http: HttpClient) {}

  getAllFunds(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    label?: string,
    groups?: string[],
    isActive?: boolean
  ): Observable<Page<FundModel>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (isActive) {
      params = params.set('isActive', '' + isActive);
    }

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }
    if (label) {
      params = params.set('label', label);
    }
    if (groups && groups.length > 0) {
      params = params.set('groups', groups.join(','));
    }

    return this.http.get<Page<FundModel>>(this.url, { params });
  }

  downloadFunds(label?: string, groups?: string[]): Observable<Blob> {
    let params: HttpParams = new HttpParams();

    if (label) {
      params = params.set('label', label);
    }
    if (groups && groups.length > 0) {
      params = params.set('groups', groups.join(','));
    }

    return this.http.get(this.url + '/download', { params, responseType: 'blob' });
  }

  createFund(fund: FundModel): Observable<FundModel> {
    return this.http.post<FundModel>(this.url, fund);
  }

  updateFund(fund: FundModel): Observable<FundModel> {
    return this.http.put<FundModel>(this.url + '/' + fund.fundId, fund);
  }
}
