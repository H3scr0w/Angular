import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { of, Observable } from 'rxjs';
import { OperatorParameter, OperatorParameterDTO } from '../../models/operator-parameter';
import { Page } from '../../models/page.model';

export interface IOperatorParameterService {
  getAllOperatorParameters(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    operatorParameterFilter?: OperatorParameterDTO
  ): Observable<Page<OperatorParameterDTO>>;

  getOperatorParameter(id: number): Observable<OperatorParameterDTO>;

  addOperatorParameter(operatorParameter: OperatorParameter): Observable<OperatorParameter>;

  editOperatorParameter(operatorParameter: OperatorParameter): Observable<OperatorParameter>;

  getOperatorParameterByOperatorAndLabelAndType(
    operatorId: number,
    label: string,
    type: string
  ): Observable<OperatorParameter>;
}

@Injectable({
  providedIn: 'root'
})
export class OperatorParameterService {
  private url = '/operator-parameters';

  constructor(private http: HttpClient) {}

  getAllOperatorParameters(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    operatorParameterFilter?: OperatorParameterDTO
  ): Observable<Page<OperatorParameterDTO>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (operatorParameterFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (operatorParameterFilter.operator != null && operatorParameterFilter.operator.id) {
        params = params.set('operatorId', '' + operatorParameterFilter.operator.id);
      }
      if (operatorParameterFilter.type) {
        params = params.set('type', '' + operatorParameterFilter.type.trim());
      }
    }

    return this.http.get<Page<OperatorParameterDTO>>(this.url, { params });
  }

  getOperatorParameter(id: number): Observable<OperatorParameterDTO> {
    return this.http.get<OperatorParameterDTO>(this.url + '/' + id);
  }

  addOperatorParameter(operatorParameter: OperatorParameter): Observable<OperatorParameter> {
    return this.http.post<OperatorParameter>(this.url, operatorParameter);
  }

  editOperatorParameter(operatorParameter: OperatorParameter): Observable<OperatorParameter> {
    return this.http.put<OperatorParameter>(this.url + '/' + operatorParameter.id, operatorParameter);
  }

  getOperatorParameterByOperatorAndLabelAndType(
    operatorId: number,
    label: string,
    type: string
  ): Observable<OperatorParameter> {
    if (!operatorId && !label && !type) {
      return of(null);
    }
    const headers: HttpHeaders = new HttpHeaders().set('X-Skip-Error-Interceptor', 'true');
    return this.http.get<OperatorParameter>(
      this.url + '/operators/' + operatorId + '/labels/' + label + '/types/' + type,
      { headers }
    );
  }
}
