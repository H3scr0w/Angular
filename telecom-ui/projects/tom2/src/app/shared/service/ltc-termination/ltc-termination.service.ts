import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { of, Observable } from 'rxjs';
import { LtcTermination, LtcTerminationDTO } from '../../models/ltc-termination';
import { Page } from '../../models/page.model';

export interface ILtcTerminationService {
  getAllLtcTermination(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    ltcTerminationFilter?: LtcTerminationDTO
  ): Observable<Page<LtcTerminationDTO>>;

  getLtcTermination(id: number): Observable<LtcTerminationDTO>;

  addLtcTermination(ltcTermination: LtcTermination): Observable<LtcTermination>;

  editLtcTermination(ltcTermination: LtcTermination): Observable<LtcTermination>;

  deleteLtcTermination(id: number): Observable<LtcTermination>;

  getLtcTerminationByOperatorAndCatalog(operatorId: number, catalogId: number): Observable<LtcTermination>;
}

@Injectable({
  providedIn: 'root'
})
export class LtcTerminationService implements ILtcTerminationService {
  private url = '/ltc-terminations';

  constructor(private http: HttpClient) {}

  getAllLtcTermination(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    ltcTerminationFilter?: LtcTerminationDTO
  ): Observable<Page<LtcTerminationDTO>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (ltcTerminationFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (ltcTerminationFilter.operator != null && ltcTerminationFilter.operator.id) {
        params = params.set('operatorId', '' + ltcTerminationFilter.operator.id);
      }
      if (ltcTerminationFilter.catalog != null && ltcTerminationFilter.catalog.id) {
        params = params.set('catalogueId', '' + ltcTerminationFilter.catalog.id);
      }
    }
    return this.http.get<Page<LtcTerminationDTO>>(this.url, { params });
  }

  getLtcTermination(id: number): Observable<LtcTerminationDTO> {
    return this.http.get<LtcTerminationDTO>(this.url + '/' + id);
  }

  addLtcTermination(ltcTermination: LtcTermination): Observable<LtcTermination> {
    return this.http.post<LtcTermination>(this.url, ltcTermination);
  }

  editLtcTermination(ltcTermination: LtcTermination): Observable<LtcTermination> {
    return this.http.put<LtcTermination>(this.url + '/' + ltcTermination.id, ltcTermination);
  }

  deleteLtcTermination(id: number): Observable<LtcTermination> {
    return this.http.delete<LtcTermination>(this.url + '/' + id);
  }

  getLtcTerminationByOperatorAndCatalog(operatorId: number, catalogId: number): Observable<LtcTermination> {
    if (!operatorId && !catalogId) {
      return of(null);
    }
    const headers: HttpHeaders = new HttpHeaders().set('X-Skip-Error-Interceptor', 'true');
    return this.http.get<LtcTermination>(this.url + '/operators/' + operatorId + '/catalogs/' + catalogId, { headers });
  }
}
