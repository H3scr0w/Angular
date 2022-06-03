import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Page } from '@shared';
import { of, Observable } from 'rxjs';
import { SiteDeletionRequest } from '../../models/site-deletion-request';
import { SiteRequest } from '../../models/site-request';
import { SupervisorRequestFilter } from '../../models/supervisor-request';

export interface ISiteDeletionRequestService {
  getAllSiteDeletionRequest(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    supervisorRequestFilter?: SupervisorRequestFilter
  ): Observable<Page<SiteRequest>>;

  getSiteDeletionRequestById(id: number): Observable<SiteDeletionRequest>;
  createSiteDeletionRequest(siteDeletionRequest: SiteDeletionRequest): Observable<SiteDeletionRequest>;
  validateSiteDeletionRequest(siteDeletionRequest: SiteDeletionRequest): Observable<SiteDeletionRequest>;
  cancelSiteDeletionRequest(siteRequest: SiteRequest): Observable<SiteDeletionRequest>;
}
@Injectable({
  providedIn: 'root'
})
export class SiteDeletionRequestService {
  private url = '/site-deletion-requests';

  constructor(private http: HttpClient) {}

  getAllSiteDeletionRequest(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    supervisorRequestFilter?: SupervisorRequestFilter
  ): Observable<Page<SiteRequest>> {
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
        params = params.set('requestType', '' + supervisorRequestFilter.action.trim());
      }
      if (supervisorRequestFilter.applicant) {
        params = params.set('applicant', '' + supervisorRequestFilter.applicant.id);
      }
      if (supervisorRequestFilter.requestDate) {
        params = params.set('requestDate', '' + supervisorRequestFilter.requestDate);
      }
    }

    return this.http.get<Page<SiteRequest>>(this.url, { params });
  }

  getSiteDeletionRequestById(id: number): Observable<SiteDeletionRequest> {
    if (!id) {
      const siteDeletionRequest: SiteDeletionRequest = new SiteDeletionRequest();
      return of(siteDeletionRequest);
    }
    return this.http.get<SiteDeletionRequest>(this.url + '/' + id);
  }

  createSiteDeletionRequest(siteDeletionRequest: SiteDeletionRequest): Observable<SiteDeletionRequest> {
    return this.http.post<SiteDeletionRequest>(this.url, siteDeletionRequest);
  }

  validateSiteDeletionRequest(siteDeletionRequest: SiteDeletionRequest): Observable<SiteDeletionRequest> {
    return this.http.put<SiteDeletionRequest>(this.url + '/validate/' + siteDeletionRequest.id, siteDeletionRequest);
  }

  cancelSiteDeletionRequest(siteRequest: SiteRequest): Observable<SiteDeletionRequest> {
    return this.http.put<SiteDeletionRequest>(this.url + '/cancel/' + siteRequest.id, siteRequest);
  }
}
