import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../../models/page.model';
import { Criteria } from '../../../models/tools/qualys/util/criteria.model';
import { Filters } from '../../../models/tools/qualys/util/filters.model';
import { WebAppAuthRecord } from '../../../models/tools/qualys/webappauthrecord.model';

@Injectable({
  providedIn: 'root'
})
export class WebappauthrecordService {
  private url = '/tools/qualys/webappauthrecords';

  constructor(private http: HttpClient) {}

  searchWebAppAuthRecords(filters: Filters, index?: number, size?: number): Observable<Page<WebAppAuthRecord>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.post<Page<WebAppAuthRecord>>(this.url + '/search', filters, { params });
  }

  searchWebAppAuthRecordsByName(name: string, index?: number, size?: number): Observable<Page<WebAppAuthRecord>> {
    const criteria: Criteria = new Criteria();
    criteria.field = 'name';
    criteria.operator = 'CONTAINS';
    criteria.value = name;

    const filters: Filters = new Filters();
    filters.Criteria = [criteria];

    return this.searchWebAppAuthRecords(filters, index, size);
  }

  getWebAppAuthRecords(index?: number, size?: number): Observable<Page<WebAppAuthRecord>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.get<Page<WebAppAuthRecord>>(this.url, { params });
  }

  getWebAppAuthRecord(webAppAuthRecordId: number): Observable<WebAppAuthRecord> {
    return this.http.get<WebAppAuthRecord>(this.url + '/' + webAppAuthRecordId);
  }

  createWebAppAuthRecord(webAppAuthRecord: WebAppAuthRecord): Observable<WebAppAuthRecord> {
    return this.http.post<WebAppAuthRecord>(this.url, webAppAuthRecord);
  }

  updateWebAppAuthRecord(webAppAuthRecordId: number, webAppAuthRecord: WebAppAuthRecord): Observable<WebAppAuthRecord> {
    return this.http.put<WebAppAuthRecord>(this.url + '/' + webAppAuthRecordId, webAppAuthRecord);
  }

  deleteWebAppAuthRecord(webAppAuthRecordId: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + webAppAuthRecordId);
  }
}
