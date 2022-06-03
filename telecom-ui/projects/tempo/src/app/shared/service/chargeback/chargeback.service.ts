import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Chargeback, ChargebackFilter } from '../../models/chargeback';
import { Page } from '../../models/page.model';

export interface IChargebackService {
  getAllChargebacks(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    chargebackFilter?: ChargebackFilter
  ): Observable<Page<Chargeback>>;

  addChargeback(chargeback: Chargeback): Observable<Chargeback>;
  getChargebackById(id: number): Observable<Chargeback>;
}

@Injectable({
  providedIn: 'root'
})
export class ChargebackService implements IChargebackService {
  private _url = '/chargebacks';

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    if (!value) {
      this._url = '/chargebacks';
    } else {
      this._url = value;
    }
  }
  constructor(private http: HttpClient) {}

  getAllChargebacks(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    chargebackFilter?: ChargebackFilter
  ): Observable<Page<Chargeback>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    } else if (chargebackFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (chargebackFilter.label) {
        params = params.set('label', '' + chargebackFilter.label.trim());
      }
      if (chargebackFilter.sapAccount) {
        params = params.set('sapAccount', '' + chargebackFilter.sapAccount.trim());
      }
      if (chargebackFilter.sif) {
        params = params.set('sif', '' + chargebackFilter.sif.trim());
      }
      if (chargebackFilter.display) {
        params = params.set('display', '' + chargebackFilter.display);
      }
      if (chargebackFilter.orderId) {
        params = params.set('orderId', '' + chargebackFilter.orderId);
      }
    }
    return this.http.get<Page<Chargeback>>(this.url, { params });
  }

  addChargeback(chargeback: Chargeback): Observable<Chargeback> {
    return this.http.post<Chargeback>(this.url, chargeback);
  }

  getChargebackById(id: number): Observable<Chargeback> {
    return this.http.get<Chargeback>(this.url + '/' + id);
  }
}
