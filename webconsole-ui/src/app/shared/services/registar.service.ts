import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { Registar } from '../models/registar.model';

@Injectable({
  providedIn: 'root'
})
export class RegistarService {
  private url = '/hosting/registars';

  constructor(private http: HttpClient) { }

  getAllRegistars(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string): Observable<Page<Registar>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<Registar>>(this.url, { params });
  }

  getAllRegistarsByName(name: string): Observable<Page<Registar>> {
    const params: HttpParams = new HttpParams().set('name', '' + name);
    return this.http.get<Page<Registar>>(this.url, { params });
  }

  createOrUpdate(registarCode: string, registar: Registar): Observable<Registar> {
    return this.http.put<Registar>(this.url + '/' + registarCode, registar);
  }
}
