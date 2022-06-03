import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Page } from '../../models/page.model';
import { SiteType } from '../../models/site-type';

export interface ISiteTypeService {
  getAllSiteTypes(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<SiteType>>;
}
@Injectable({
  providedIn: 'root'
})
export class SiteTypeService implements ISiteTypeService {
  private url = '/site-types';

  constructor(private http: HttpClient) {}

  getAllSiteTypes(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<SiteType>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<SiteType>>(this.url, { params });
  }
}
