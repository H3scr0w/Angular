import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Page } from '@shared';
import { of, Observable } from 'rxjs';
import { SiteModificationRequest } from '../../models/site-modification-request';
import { SiteRequest } from '../../models/site-request';
import { SupervisorRequestFilter } from '../../models/supervisor-request';

export interface ISiteModificationRequestService {
  getAllSiteModificationRequest(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    supervisorRequestFilter?: SupervisorRequestFilter
  ): Observable<Page<SiteRequest>>;
  getSiteModificationRequestById(id: number): Observable<SiteModificationRequest>;
  createSiteModificationRequest(siteDeletionRequest: SiteModificationRequest): Observable<SiteModificationRequest>;
  validateSiteModificationRequest(siteDeletionRequest: SiteModificationRequest): Observable<SiteModificationRequest>;
  cancelSiteModificationRequest(siteRequest: SiteRequest): Observable<SiteModificationRequest>;
}

@Injectable({
  providedIn: 'root'
})
export class SiteModificationRequestService implements ISiteModificationRequestService {
  private url = '/site-modification-requests';

  constructor(private http: HttpClient) {}

  getAllSiteModificationRequest(
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

  getSiteModificationRequestById(id: number): Observable<SiteModificationRequest> {
    if (!id) {
      const siteModificationRequest: SiteModificationRequest = new SiteModificationRequest();
      return of(siteModificationRequest);
    }
    return this.http.get<SiteModificationRequest>(this.url + '/' + id);
  }

  createSiteModificationRequest(siteModificationRequest: SiteModificationRequest): Observable<SiteModificationRequest> {
    return this.http.post<SiteModificationRequest>(this.url, siteModificationRequest);
  }

  validateSiteModificationRequest(
    siteModificationRequest: SiteModificationRequest
  ): Observable<SiteModificationRequest> {
    return this.http.put<SiteModificationRequest>(
      this.url + '/validate/' + siteModificationRequest.id,
      siteModificationRequest
    );
  }

  cancelSiteModificationRequest(siteRequest: SiteRequest): Observable<SiteModificationRequest> {
    return this.http.put<SiteModificationRequest>(this.url + '/cancel/' + siteRequest.id, siteRequest);
  }
}
