import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { CostUpperLimit } from '../../models/cost-upper-limit.model';
import { Page } from '../../models/page.model';

export interface ICostUpperLimitService {
  getAllCostUpperLimits(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<CostUpperLimit>>;

  updateCostUpperLimits(operatorMailTemplates: CostUpperLimit[]): Observable<CostUpperLimit[]>;

  updateCostUpperLimit(operatorMailTemplate: CostUpperLimit): Observable<CostUpperLimit>;
}

@Injectable({
  providedIn: 'root'
})
export class CostUpperLimitService implements ICostUpperLimitService {
  private url = '/cost-upper-limits';
  constructor(private http: HttpClient) {}

  getAllCostUpperLimits(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<CostUpperLimit>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortDirection && sortField) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<CostUpperLimit>>(this.url, { params });
  }

  updateCostUpperLimit(costUpperLimit: CostUpperLimit): Observable<CostUpperLimit> {
    return this.http.put<CostUpperLimit>(this.url + '/' + costUpperLimit.id, costUpperLimit);
  }

  updateCostUpperLimits(costUpperLimit: CostUpperLimit[]): Observable<CostUpperLimit[]> {
    return this.http.put<CostUpperLimit[]>(this.url, costUpperLimit);
  }
}
