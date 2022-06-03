import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Delegation, DelegationFilter } from '../../models/delegation';
import { DelegationHome } from '../../models/delegation-home';
import { Page } from '../../models/page.model';

export interface IDelegationService {
  getAllDelegations(
    search?: string,
    delegationFilter?: DelegationFilter,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<Delegation>>;

  getAllDelegationsSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<DelegationHome>>;

  addDelegation(delegation: Delegation): Observable<Delegation>;
  editDelegation(delegation: Delegation): Observable<Delegation>;
  deleteDelegation(id: string): Observable<Delegation>;
  recoverDelegation(delegation: Delegation): Observable<Delegation>;
}

@Injectable({
  providedIn: 'root'
})
export class DelegationService implements IDelegationService {
  private url = '/delegations';

  constructor(private http: HttpClient) {}

  getAllDelegations(
    search?: string,
    delegationFilter?: DelegationFilter,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<Delegation>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (delegationFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (delegationFilter.id) {
        params = params.set('id', '' + delegationFilter.id.trim());
      }
      if (delegationFilter.name) {
        params = params.set('name', '' + delegationFilter.name.trim());
      }
      if (delegationFilter.showArchived) {
        params = params.set('showArchived', '' + delegationFilter.showArchived);
      }
    }

    return this.http.get<Page<Delegation>>(this.url, { params });
  }

  getAllDelegationsSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<DelegationHome>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<DelegationHome>>(this.url + '/sites-count', { params });
  }

  addDelegation(delegation: Delegation): Observable<Delegation> {
    return this.http.post<Delegation>(this.url, delegation);
  }

  editDelegation(delegation: Delegation): Observable<Delegation> {
    return this.http.put<Delegation>(this.url + '/' + delegation.id, delegation);
  }

  deleteDelegation(id: string): Observable<Delegation> {
    return this.http.delete<Delegation>(this.url + '/' + id);
  }

  recoverDelegation(delegation: Delegation): Observable<Delegation> {
    return this.http.put<Delegation>(this.url + '/recover/' + delegation.id, delegation);
  }
}
