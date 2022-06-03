import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { IspCarrier } from '../../models/isp-carrier';
import { Page } from '../../models/page.model';

export interface IIspCarrierService {
  getAllIspCarriers(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<IspCarrier>>;

  getIspCarrier(id: number): Observable<IspCarrier>;

  addIspCarrier(ispCarrier: IspCarrier): Observable<IspCarrier>;

  editIspCarrier(ispCarrier: IspCarrier): Observable<IspCarrier>;
}

@Injectable({
  providedIn: 'root'
})
export class IspCarrierService implements IIspCarrierService {
  private url = '/isp-carriers';

  constructor(private http: HttpClient) {}

  getAllIspCarriers(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    ispCarrierFilter?: IspCarrier
  ): Observable<Page<IspCarrier>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (ispCarrierFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (ispCarrierFilter.ispCarrier) {
        params = params.set('ispCarrier', '' + ispCarrierFilter.ispCarrier.trim());
      }
      if (ispCarrierFilter.ispHelpdeskContact) {
        params = params.set('ispHelpdeskContact', '' + ispCarrierFilter.ispHelpdeskContact);
      }
    }

    return this.http.get<Page<IspCarrier>>(this.url, { params });
  }

  getIspCarrier(id: number): Observable<IspCarrier> {
    return this.http.get<IspCarrier>(this.url + '/' + id);
  }

  addIspCarrier(ispCarrier: IspCarrier): Observable<IspCarrier> {
    return this.http.post<IspCarrier>(this.url, ispCarrier);
  }

  editIspCarrier(ispCarrier: IspCarrier): Observable<IspCarrier> {
    return this.http.put<IspCarrier>(this.url + '/' + ispCarrier.id, ispCarrier);
  }
}
