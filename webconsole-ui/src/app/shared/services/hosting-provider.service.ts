import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { HostingProvider } from '../models/hosting-provider.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class HostingProviderService {
  private url = '/hosting/providers';

  constructor(private http: HttpClient) {}

  getAllHostingProviders(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<HostingProvider>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<HostingProvider>>(this.url, { params });
  }

  getAllHostingProvidersByName(name: string): Observable<Page<HostingProvider>> {
    const params: HttpParams = new HttpParams().set('name', '' + name);
    return this.http.get<Page<HostingProvider>>(this.url, { params });
  }

  createOrUpdate(hostingProviderCode: string, hostingProvider: HostingProvider): Observable<HostingProvider> {
    return this.http.put<HostingProvider>(this.url + '/' + hostingProviderCode, hostingProvider);
  }
}
