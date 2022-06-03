import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Page, TimeZone } from '@shared';
import { Observable } from 'rxjs';

export interface ITimeZoneService {
  getAllTimeZones(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<TimeZone>>;
}

@Injectable({
  providedIn: 'root'
})
export class TimeZoneService {
  private url = '/spo/timezones';

  constructor(private http: HttpClient) {}

  getAllTimeZones(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    timeZoneFilter?: TimeZone
  ): Observable<Page<TimeZone>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    } else if (timeZoneFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (timeZoneFilter.country) {
        params = params.set('country', '' + timeZoneFilter.country);
      }
    }
    return this.http.get<Page<TimeZone>>(this.url, { params });
  }

  getTimezoneById(id?: number): Observable<Page<TimeZone>> {
    let params: HttpParams = new HttpParams().set('isAdvanceFilter', 'true');
    if (id) {
      params = params.set('id', `${id}`);
    }
    return this.http.get<Page<TimeZone>>(this.url, { params });
  }
}
