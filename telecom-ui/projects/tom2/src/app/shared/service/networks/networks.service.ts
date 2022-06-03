import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Networks, NetworksFilter } from '../../models/networks.model';
import { Page } from '../../models/page.model';

export interface INetworkService {
  getAllNetworks(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: NetworksFilter
  ): Observable<Page<Networks>>;

  addNetwork(networks: Networks): Observable<Networks>;

  editNetwork(networks: Networks): Observable<Networks>;
}

@Injectable({
  providedIn: 'root'
})
export class NetworksService implements INetworkService {
  private url = '/common/networks';

  constructor(private http: HttpClient) {}

  addNetwork(networks: Networks): Observable<Networks> {
    return this.http.post<Networks>(this.url, networks);
  }

  editNetwork(networks: Networks): Observable<Networks> {
    return this.http.put<Networks>(this.url + '/' + networks.id, networks);
  }

  getAllNetworks(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: NetworksFilter
  ): Observable<Page<Networks>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (advancefilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (advancefilter.id) {
        params = params.set('id', '' + advancefilter.id);
      }
      if (advancefilter.name) {
        params = params.set('name', '' + advancefilter.name);
      }
      if (advancefilter.code) {
        params = params.set('code', '' + advancefilter.code);
      }
      if (advancefilter.operatorId) {
        params = params.set('operatorId', '' + advancefilter.operatorId);
      }
    }

    return this.http.get<Page<Networks>>(this.url, { params });
  }
}
