import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Cms } from '../models/cms.model';
import { Page } from './../models/page.model';

@Injectable({ providedIn: 'root' })
export class CmsService {
  private url = '/cms';

  constructor(private http: HttpClient) { }

  getAllCms(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string): Observable<Page<Cms>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<Cms>>(this.url, { params });
  }

  getAllCmsByName(name: string): Observable<Page<Cms>> {
    const params: HttpParams = new HttpParams().set('name', name);
    return this.http.get<Page<Cms>>(this.url, { params });
  }

  createOrUpdate(cms: Cms, cmsCode: string): Observable<Cms> {
    return this.http.put<Cms>(this.url + '/' + cmsCode, cms);
  }
}
