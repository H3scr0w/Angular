import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { CsvParameter } from '../../models/csv-parameter';
import { Page } from '../../models/page.model';

export interface ICsvParameterService {
  getAllCsvParameter(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<CsvParameter>>;

  addCsvParameter(csvParameter: CsvParameter): Observable<CsvParameter>;
}

@Injectable({
  providedIn: 'root'
})
export class CsvParameterService implements ICsvParameterService {
  private url = '/csvParameters';

  constructor(private http: HttpClient) {}

  getAllCsvParameter(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    csvParameterFilter?: CsvParameter
  ): Observable<Page<CsvParameter>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (csvParameterFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (csvParameterFilter.object) {
        params = params.set('object', '' + csvParameterFilter.object);
      }
      if (csvParameterFilter.operator) {
        params = params.set('operatorId', '' + csvParameterFilter.operator);
      }
    }
    return this.http.get<Page<CsvParameter>>(this.url, { params });
  }

  addCsvParameter(csvParameter: CsvParameter): Observable<CsvParameter> {
    return this.http.post<CsvParameter>('/csvParameters', csvParameter);
  }

  updateAll(csvParameterList: CsvParameter[]) {
    return this.http.put<CsvParameter>('/csvParameters', csvParameterList);
  }
}
