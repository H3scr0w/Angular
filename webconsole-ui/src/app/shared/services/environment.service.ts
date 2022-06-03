import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Environment } from '../models/environment.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  private url = '/environments';

  constructor(private http: HttpClient) {}

  getAllEnvironments(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<Environment>> {
    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<Environment>>(this.url, { params });
  }

  getAllEnvironmentsByName(name: string): Observable<Page<Environment>> {
    const params: HttpParams = new HttpParams().set('name', '' + name);
    return this.http.get<Page<Environment>>(this.url, { params });
  }

  createOrUpdate(environmentCode: string, environment: Environment): Observable<Environment> {
    return this.http.put<Environment>(this.url + '/' + environmentCode, environment);
  }
}
