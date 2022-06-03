import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Docroot } from '../models/docroot.model';
import { DocrootCore } from './../models/docrootcore.model';
import { Page } from './../models/page.model';

@Injectable({ providedIn: 'root' })
export class DrupalDocrootCoreService {
  private url = '/drupaldocrootcore';

  constructor(private http: HttpClient) { }

  getAllDrupals(index?: number,
                size?: number,
                sortField?: string,
                sortDirection?: SortDirection,
                search?: string): Observable<Page<DocrootCore>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<DocrootCore>>(this.url, { params });
  }

  getDrupalDocrootCoresByName(name: string): Observable<Page<DocrootCore>> {
    let params: HttpParams = new HttpParams().set('sort', 'name,asc');
    if (name) {
      params = params.set('name', name);
    }
    return this.http.get<Page<DocrootCore>>(this.url, { params });
  }

  getDrupalDocrootCoreDetail(code: string): Observable<Docroot[]> {
    return this.http.get<Docroot[]>(this.url + '/' + code + '/docroots');
  }

  createOrUpdate(docroot: DocrootCore, docrootCode: string): Observable<Docroot> {
    return this.http.put<Docroot>(this.url + '/' + docrootCode, docroot);
  }
}
