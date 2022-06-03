import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../../models/page.model';
import { Criteria } from '../../../models/tools/qualys/util/criteria.model';
import { Filters } from '../../../models/tools/qualys/util/filters.model';
import { WebApp } from '../../../models/tools/qualys/webapp.model';

@Injectable({
  providedIn: 'root'
})
export class WebappService {
  private url = '/tools/qualys/webapps';

  constructor(private http: HttpClient) {}

  searchWebApps(filters: Filters, index?: number, size?: number): Observable<Page<WebApp>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.post<Page<WebApp>>(this.url + '/search', filters, { params });
  }

  searchWebAppsByName(name: string, index?: number, size?: number): Observable<Page<WebApp>> {
    const criteria: Criteria = new Criteria();
    criteria.field = 'name';
    criteria.operator = 'CONTAINS';
    criteria.value = name;

    const filters: Filters = new Filters();
    filters.Criteria = [criteria];

    return this.searchWebApps(filters, index, size);
  }

  getWebApps(index?: number, size?: number): Observable<Page<WebApp>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.get<Page<WebApp>>(this.url, { params });
  }

  getWebApp(webAppId: number): Observable<WebApp> {
    return this.http.get<WebApp>(this.url + '/' + webAppId);
  }

  createWebApp(webApp: WebApp): Observable<WebApp> {
    return this.http.post<WebApp>(this.url, webApp);
  }

  updateWebApp(webAppId: number, webApp: WebApp): Observable<WebApp> {
    return this.http.put<WebApp>(this.url + '/' + webAppId, webApp);
  }

  deleteWebApp(webAppId: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + webAppId);
  }
}
