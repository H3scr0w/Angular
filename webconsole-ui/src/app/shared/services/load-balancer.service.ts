import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { LoadBalancer } from '../models/loadbalancer.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class LoadBalancerService {
  private url = '/hosting/loadbalancers';

  constructor(private http: HttpClient) {}

  getAllLoadBalancers(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<LoadBalancer>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<LoadBalancer>>(this.url, { params });
  }

  getAllLoadBalancersByName(name: string): Observable<Page<LoadBalancer>> {
    const params: HttpParams = new HttpParams().set('name', '' + name);
    return this.http.get<Page<LoadBalancer>>(this.url, { params });
  }

  createOrUpdate(loadBalancerCode: string, loadBalancer: LoadBalancer): Observable<LoadBalancer> {
    return this.http.put<LoadBalancer>(this.url + '/' + loadBalancerCode, loadBalancer);
  }
}
