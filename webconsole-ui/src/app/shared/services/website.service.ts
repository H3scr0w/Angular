import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Domain } from '../models/domain.model';
import { Page } from '../models/page.model';
import { Docroot } from './../models/docroot.model';
import { Website } from './../models/website.model';

@Injectable({ providedIn: 'root' })
export class WebsiteService {
  private url = '/websites';

  constructor(private http: HttpClient) { }

  getWebsites(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    showEnable?: boolean): Observable<Page<Website>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (showEnable !== null && showEnable !== undefined) {
      params = params.set('showEnable', `${showEnable}`);
    }
    return this.http.get<Page<Website>>(this.url, { params });
  }

  getWebsitesByName(name: string, showEnable?: boolean): Observable<Page<Website>> {
    let params: HttpParams = new HttpParams().set('sort', 'name,asc');
    if (name) {
      params = params.set('name', name);
    }
    if (showEnable !== null && showEnable !== undefined) {
      params = params.set('showEnable', `${showEnable}`);
    }
    return this.http.get<Page<Website>>(this.url, { params });
  }

  getWebsitesByNameAndQualysEnable(
    name: string,
    isQualysEnabled: boolean,
    showEnable?: boolean): Observable<Page<Website>> {
    let params: HttpParams = new HttpParams()
      .set('qualysEnabled', '' + isQualysEnabled)
      .set('sort', 'name,asc');

    if (name) {
      params = params.set('name', name);
    }

    if (showEnable === null || showEnable === undefined) {
      params = params.set('showEnable', 'true');
    }
    else {
      params = params.set('showEnable', `${showEnable}`);
    }
    return this.http.get<Page<Website>>(this.url, { params });
  }

  getWebsite(code: string): Observable<Website> {
    return this.http.get<Website>(this.url + '/' + code);
  }

  getWebsiteDocroots(code: string, environments?: boolean): Observable<Docroot[]> {
    let params: HttpParams = new HttpParams();
    if (environments !== undefined) {
      params = params.set('environments', '' + environments);
    }
    return this.http.get<Docroot[]>(this.url + '/' + code + '/docroots', { params });
  }

  getWebsiteDomains(
    code: string,
    waf?: boolean,
    tree?: boolean,
    docrootCode?: string,
    environmentCode?: string
  ): Observable<Domain[]> {
    let params: HttpParams = new HttpParams();
    if (waf !== undefined && waf !== null) {
      params = params.set('waf', '' + waf);
    }
    if (tree !== undefined && tree !== null) {
      params = params.set('tree', '' + tree);
      params = params.set('docrootCode', '' + docrootCode);
      params = params.set('environmentCode', '' + environmentCode);
    }

    return this.http.get<Domain[]>(this.url + '/' + code + '/domains', { params });
  }

  createOrUpdateWebsite(code: string, website: Website): Observable<Website> {
    return this.http.put<Website>(this.url + '/' + code, website);
  }
}
