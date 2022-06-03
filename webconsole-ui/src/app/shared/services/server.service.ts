import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { Server } from '../models/server.model';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private url = '/servers';

  constructor(private http: HttpClient) { }

  getAllServers(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string): Observable<Page<Server>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<Server>>(this.url, { params });
  }

  getAllServersByName(name: string): Observable<Page<Server>> {
    const params: HttpParams = new HttpParams().set('name', name);
    return this.http.get<Page<Server>>(this.url, { params });
  }

  createOrUpdate(hostname: string, server: Server): Observable<Server> {
    return this.http.put<Server>(this.url + '/' + hostname, server);
  }
}
