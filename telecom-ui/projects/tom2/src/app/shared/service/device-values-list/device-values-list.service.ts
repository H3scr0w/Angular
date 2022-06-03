import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { DeviceValuesList } from '../../models/device-values-list';
import { Page } from '../../models/page.model';

export interface IDeviceValuesListService {
  getAllDeviceValuesList(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    field?: string
  ): Observable<Page<DeviceValuesList>>;

  getDeviceValuesList(id: number): Observable<DeviceValuesList>;

  addDeviceValuesList(deviceValuesList: DeviceValuesList): Observable<DeviceValuesList>;

  editDeviceValuesList(deviceValuesList: DeviceValuesList): Observable<DeviceValuesList>;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceValuesListService {
  private url = '/spo/device-values-list';

  constructor(private http: HttpClient) {}

  getAllDeviceValuesList(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    field?: string
  ): Observable<Page<DeviceValuesList>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (field) {
      params = params.set('field', field);
    }
    return this.http.get<Page<DeviceValuesList>>(this.url, { params });
  }

  getDeviceValueList(id: string): Observable<DeviceValuesList> {
    return this.http.get<DeviceValuesList>(this.url + '/' + id);
  }

  addDeviceValuesList(deviceValuesList: DeviceValuesList): Observable<DeviceValuesList> {
    return this.http.post<DeviceValuesList>(this.url, deviceValuesList);
  }

  editDeviceValuesList(deviceValuesList: DeviceValuesList): Observable<DeviceValuesList> {
    return this.http.put<DeviceValuesList>(this.url + '/' + deviceValuesList.id, deviceValuesList);
  }
}
