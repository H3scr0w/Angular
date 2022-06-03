import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Operator } from '../../models/operators';
import { Page } from '../../models/page.model';

export interface IOperatorsService {
  getAllOperators(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<Operator>>;

  addOperator(operator: Operator): Observable<Operator>;

  editOperator(operator: Operator): Observable<Operator>;

  getOperatorById(id: number): Observable<Operator>;
}

@Injectable({
  providedIn: 'root'
})
export class OperatorsService implements IOperatorsService {
  private url = '/common/operators';

  constructor(private http: HttpClient) {}

  getAllOperators(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<Operator>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<Operator>>(this.url, { params });
  }

  addOperator(operator: Operator): Observable<Operator> {
    return this.http.post<Operator>(this.url, operator);
  }

  editOperator(operator: Operator): Observable<Operator> {
    return this.http.put<Operator>(this.url + '/' + operator.id, operator);
  }

  getOperatorById(id: number): Observable<Operator> {
    return this.http.get<Operator>(this.url + '/' + id);
  }
}
