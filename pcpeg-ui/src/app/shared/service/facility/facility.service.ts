import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { FacilityFilter, FacilityModel } from '../../models/facility.model';
import { Page } from '../../models/page.model';

export interface IFacilityService {
  getAllFacilities(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advanceFilter?: FacilityFilter
  ): Observable<Page<FacilityModel>>;

  getDistinctCompanies(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    filter?: FacilityFilter
  ): Observable<FacilityModel[]>;

  downloadFacilities(advanceFilter?: FacilityFilter): Observable<Blob>;

  createOrUpdateFacility(facility: FacilityModel): Observable<FacilityModel>;
}
@Injectable({
  providedIn: 'root'
})
export class FacilityService implements IFacilityService {
  private url = '/facilities';

  constructor(private http: HttpClient) {}

  downloadFacilities(advanceFilter?: FacilityFilter): Observable<Blob> {
    let params: HttpParams = new HttpParams();
    if (advanceFilter) {
      if (advanceFilter.facilityLabel) {
        params = params.set('label', advanceFilter.facilityLabel);
      }

      if (advanceFilter.active) {
        params = params.set('isActive', '' + advanceFilter.active);
      }

      if (advanceFilter.societeSid && advanceFilter.societeSid !== 0) {
        params = params.set('societeSid', '' + advanceFilter.societeSid);
      }

      if (advanceFilter.codeSif) {
        params = params.set('codeSif', advanceFilter.codeSif);
      }
    }
    return this.http.get(this.url + '/download', { params, responseType: 'blob' });
  }

  createOrUpdateFacility(facility: FacilityModel): Observable<FacilityModel> {
    return this.http.post<FacilityModel>(this.url, facility);
  }

  getAllFacilities(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advanceFilter?: FacilityFilter
  ): Observable<Page<FacilityModel>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (advanceFilter) {
      if (advanceFilter.facilityLabel) {
        params = params.set('label', advanceFilter.facilityLabel);
      }

      if (advanceFilter.active) {
        params = params.set('isActive', '' + advanceFilter.active);
      }

      if (advanceFilter.societeSid && advanceFilter.societeSid !== 0) {
        params = params.set('societeSid', '' + advanceFilter.societeSid);
      }

      if (advanceFilter.codeSif) {
        params = params.set('codeSif', advanceFilter.codeSif);
      }
    }

    return this.http.get<Page<FacilityModel>>(this.url, { params });
  }

  getDistinctCompanies(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    filter?: FacilityFilter
  ): Observable<FacilityModel[]> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (filter) {
      if (filter.codeSif) {
        params = params.set('codeSif', filter.codeSif);
      }
      if (filter.companyLabel) {
        params = params.set('companyLabel', filter.companyLabel);
      }
    }

    return this.http.get<FacilityModel[]>(this.url + '/companies', { params });
  }
}
