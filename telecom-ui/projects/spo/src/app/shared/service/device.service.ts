import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Contact } from '../../../../../sirene/src/app/shared/models/contact';
import { DeviceStatus } from '../enums/enum';
import { Page } from '../models/page.model';

export interface IDeviceService {
  getContactBySGTConnectionCode(
    sgtConnectionCode?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<Contact>>;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService implements IDeviceService {
  private _url = '/devices';

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    if (!value) {
      this._url = '/devices';
    } else {
      this._url = value;
    }
  }
  constructor(private http: HttpClient) {}

  getContactBySGTConnectionCode(
    sgtConnectionCode: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<Contact>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }
    if (sgtConnectionCode) {
      params = params.set('isAdvanceFilter', '' + 'true').set('sgtConnectionCode', '' + sgtConnectionCode);
    }
    params = params.set('statuses', '' + [DeviceStatus.ACTIVE, DeviceStatus.PROACTIVE]);

    return this.http.get<Page<Contact>>(this.url + '/contacts', { params });
  }
}
