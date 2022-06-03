import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { of, Observable } from 'rxjs';
import { IspInformation, IspInformationFilter } from '../../models/isp-information';
import { Page } from '../../models/page.model';

export interface IIspBandwidthService {
  getAllIspBandwidths(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: IspInformationFilter
  ): Observable<Page<IspInformation>>;

  downloadIspInformation(orderIds: string[]): Observable<Blob>;

  addIspBandwidth(ispInfo: IspInformation): Observable<IspInformation>;

  getIspInformationByRequest(requesId: number): Observable<IspInformation>;

  getIspInformationByOrder(orderId: string): Observable<IspInformation>;
}

@Injectable({
  providedIn: 'root'
})
export class IspBandwidthService implements IIspBandwidthService {
  private url = '/isp-bandwidths';

  constructor(private http: HttpClient) {}

  getAllIspBandwidths(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: IspInformationFilter
  ): Observable<Page<IspInformation>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (advancefilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (advancefilter.requestId) {
        params = params.set('requestId', '' + advancefilter.requestId);
      }
      if (advancefilter.orderId) {
        params = params.set('orderId', '' + advancefilter.orderId);
      }
      if (advancefilter.operator) {
        params = params.set('operatorIds', '' + advancefilter.operator.id);
      }
      if (advancefilter.status !== null) {
        params = params.set('statuses', '' + advancefilter.status);
      }
      if (advancefilter.rsmId) {
        params = params.set('rsmIds', '' + advancefilter.rsmId);
      }
      if (advancefilter.requesterId) {
        params = params.set('requesterIds', '' + advancefilter.requesterId);
      }
      if (advancefilter.sectorId) {
        params = params.set('sectorIds', '' + advancefilter.sectorId);
      }
      if (advancefilter.zoneId) {
        params = params.set('zoneIds', '' + advancefilter.zoneId);
      }
      if (advancefilter.companyId) {
        params = params.set('companyIds', '' + advancefilter.companyId);
      }
      if (advancefilter.mainServiceCode) {
        params = params.set('mainServiceCode', '' + advancefilter.mainServiceCode);
      }
      if (advancefilter.backUpServiceCode) {
        params = params.set('backupServiceCode', '' + advancefilter.backUpServiceCode);
      }
      if (advancefilter.lastOrderId) {
        params = params.set('lastOrderId', '' + advancefilter.lastOrderId);
      }
      if (advancefilter.lastFullyAcceptedOrderID) {
        params = params.set('lastFullyAcceptedOrderID', '' + advancefilter.lastFullyAcceptedOrderID);
      }
      if (advancefilter.backbone === 0 || advancefilter.backbone === 1) {
        params = params.set('backbone', String(advancefilter.backbone));
      }
    }

    return this.http.get<Page<IspInformation>>(this.url, { params });
  }

  downloadIspInformation(orderIds: string[]): Observable<Blob> {
    let params: HttpParams = new HttpParams();
    if (orderIds) {
      params = params.set('orderIds', `${orderIds}`);
    }
    return this.http.get(this.url + '/download', { params, responseType: 'blob' });
  }

  addIspBandwidth(ispInfo: IspInformation): Observable<IspInformation> {
    if (!ispInfo) {
      return of(null);
    }
    return this.http.post<IspInformation>(this.url, ispInfo);
  }

  getIspInformationByRequest(requestId: number): Observable<IspInformation> {
    return this.http.get<IspInformation>(this.url + '/request/' + requestId);
  }

  getIspInformationByOrder(orderId: string): Observable<IspInformation> {
    return this.http.get<IspInformation>(this.url + '/order/' + orderId);
  }
}
