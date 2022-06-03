import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Page } from '@shared';
import { of, Observable } from 'rxjs';
import { CompanyRequest } from '../../models/company-request';
import { SupervisorRequestFilter } from '../../models/supervisor-request';

export interface ICompanyRequestService {
  getAllCompanyRequests(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    supervisorRequestFilter?: SupervisorRequestFilter
  ): Observable<Page<CompanyRequest>>;

  getCompanyRequestById(id: number): Observable<CompanyRequest>;
  createCompanyRequest(companyRequest: CompanyRequest): Observable<CompanyRequest>;
  validateCompanyRequest(companyRequest: CompanyRequest): Observable<CompanyRequest>;
  cancelCompanyRequest(companyRequest: CompanyRequest): Observable<CompanyRequest>;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyRequestService implements ICompanyRequestService {
  private url = '/company-requests';

  constructor(private http: HttpClient) {}

  getAllCompanyRequests(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    supervisorRequestFilter?: SupervisorRequestFilter
  ): Observable<Page<CompanyRequest>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    } else if (supervisorRequestFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (supervisorRequestFilter.status) {
        params = params.set('status', '' + supervisorRequestFilter.status);
      }
      if (supervisorRequestFilter.action) {
        params = params.set('action', '' + supervisorRequestFilter.action.trim());
      }
      if (supervisorRequestFilter.applicant) {
        params = params.set('applicant', '' + supervisorRequestFilter.applicant.id);
      }
      if (supervisorRequestFilter.requestDate) {
        params = params.set('requestDate', '' + supervisorRequestFilter.requestDate);
      }
    }

    return this.http.get<Page<CompanyRequest>>(this.url, { params });
  }

  getCompanyRequestById(id: number): Observable<CompanyRequest> {
    if (!id) {
      const companyRequest: CompanyRequest = new CompanyRequest();
      return of(companyRequest);
    }
    return this.http.get<CompanyRequest>(this.url + '/' + id);
  }

  createCompanyRequest(companyRequest: CompanyRequest): Observable<CompanyRequest> {
    return this.http.post<CompanyRequest>(this.url, companyRequest);
  }

  validateCompanyRequest(companyRequest: CompanyRequest): Observable<CompanyRequest> {
    return this.http.put<CompanyRequest>(this.url + '/validate/' + companyRequest.id, companyRequest);
  }

  cancelCompanyRequest(companyRequest: CompanyRequest): Observable<CompanyRequest> {
    return this.http.put<CompanyRequest>(this.url + '/cancel/' + companyRequest.id, companyRequest);
  }
}
