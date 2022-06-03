import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../../models/page.model';
import { Criteria } from '../../../models/tools/qualys/util/criteria.model';
import { Filters } from '../../../models/tools/qualys/util/filters.model';
import { WasScan } from '../../../models/tools/qualys/wasscan.model';

@Injectable({
  providedIn: 'root'
})
export class WasscanService {
  private url = '/tools/qualys/wasscans';

  constructor(private http: HttpClient) {}

  searchWasScans(filters: Filters, index?: number, size?: number): Observable<Page<WasScan>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.post<Page<WasScan>>(this.url + '/search', filters, { params });
  }

  searchWasScansByName(name: string, index?: number, size?: number): Observable<Page<WasScan>> {
    const criteria: Criteria = new Criteria();
    criteria.field = 'name';
    criteria.operator = 'CONTAINS';
    criteria.value = name;

    const filters: Filters = new Filters();
    filters.Criteria = [criteria];

    return this.searchWasScans(filters, index, size);
  }

  getWasScans(index?: number, size?: number): Observable<Page<WasScan>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.get<Page<WasScan>>(this.url, { params });
  }

  launchWasScan(wasScan: WasScan): Observable<WasScan> {
    return this.http.post<WasScan>(this.url, wasScan);
  }

  cancelWasScan(wasScanId: number): Observable<WasScan> {
    return this.http.delete<WasScan>(this.url + '/cancel/' + wasScanId);
  }

  deleteWasScan(wasScanId: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + wasScanId);
  }
}
