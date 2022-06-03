import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { of, Observable } from 'rxjs';
import { AcnParameter, AcnParameterDTO } from '../../models/acn-parameter';
import { Page } from '../../models/page.model';

export interface IAcnParameterService {
  getAllAcnParameters(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    acnParameterFilter?: AcnParameterDTO
  ): Observable<Page<AcnParameterDTO>>;

  getAcnParameter(id: number): Observable<AcnParameter>;

  addAcnParameter(acnParameter: AcnParameter): Observable<AcnParameter>;

  editAcnParameter(acnParameter: AcnParameter): Observable<AcnParameter>;

  getAcnParameterByNetworkAndAcn(networkId: number, acn: string): Observable<AcnParameter>;
}

@Injectable({
  providedIn: 'root'
})
export class AcnParameterService {
  private url = '/acn-parameters';

  constructor(private http: HttpClient) {}

  getAllAcnParameters(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    acnParameterFilter?: AcnParameterDTO
  ): Observable<Page<AcnParameterDTO>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (acnParameterFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (acnParameterFilter.network != null && acnParameterFilter.network.id) {
        params = params.set('networkId', '' + acnParameterFilter.network.id);
      }
      if (acnParameterFilter.acn) {
        // @ts-ignore
        params = params.set('acn', '' + acnParameterFilter.acn);
      }
      if (acnParameterFilter.reminder) {
        // @ts-ignore
        params = params.set('reminder', '' + acnParameterFilter.reminder.value);
      }
    }

    return this.http.get<Page<AcnParameterDTO>>(this.url, { params });
  }

  getAcnParameter(id: number): Observable<AcnParameter> {
    return this.http.get<AcnParameter>(this.url + '/' + id);
  }

  addAcnParameter(acnParameter: AcnParameter): Observable<AcnParameter> {
    return this.http.post<AcnParameter>(this.url, acnParameter);
  }

  editAcnParameter(acnParameter: AcnParameter): Observable<AcnParameter> {
    return this.http.put<AcnParameter>(this.url + '/' + acnParameter.id, acnParameter);
  }

  getAcnParameterByNetworkAndAcn(networkId: number, acn: string): Observable<AcnParameter> {
    if (!networkId && !acn) {
      return of(null);
    }
    const headers: HttpHeaders = new HttpHeaders().set('X-Skip-Error-Interceptor', 'true');
    return this.http.get<AcnParameter>(this.url + '/networks/' + networkId + '/acns/' + acn, { headers });
  }
}
