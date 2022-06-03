import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Page } from '@shared';
import { of, Observable } from 'rxjs';
import { SiteCreationRequest } from '../../models/site-creation-request';
import { SiteRequest } from '../../models/site-request';
import { SupervisorRequestFilter } from '../../models/supervisor-request';
export interface ISiteCreationRequestService {
  getAllSiteCreationRequest(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    supervisorRequestFilter?: SupervisorRequestFilter
  ): Observable<Page<SiteRequest>>;
  getSiteCreationRequestById(id: number): Observable<SiteCreationRequest>;
  createSiteCreationRequest(siteDeletionRequest: FormData): Observable<SiteCreationRequest>;
  validateSiteCreationRequest(siteDeletionRequest: FormData, id: string): Observable<SiteCreationRequest>;
  cancelSiteCreationRequest(siteRequest: SiteRequest): Observable<SiteCreationRequest>;
}
@Injectable({
  providedIn: 'root'
})
export class SiteCreationRequestService implements ISiteCreationRequestService {
  private url = '/site-creation-requests';

  constructor(private http: HttpClient) {}

  getAllSiteCreationRequest(
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

  getSiteCreationRequestById(id: number): Observable<SiteCreationRequest> {
    if (!id) {
      const siteCreationRequest: SiteCreationRequest = new SiteCreationRequest();
      return of(siteCreationRequest);
    }
    return this.http.get<SiteCreationRequest>(this.url + '/' + id);
  }

  createSiteCreationRequest(siteCreationRequest: FormData): Observable<SiteCreationRequest> {
    return this.http.post<SiteCreationRequest>(this.url, siteCreationRequest);
  }

  validateSiteCreationRequest(siteCreationRequest: FormData, id: string): Observable<SiteCreationRequest> {
    return this.http.put<SiteCreationRequest>(this.url + '/validate/' + id, siteCreationRequest);
  }

  cancelSiteCreationRequest(siteRequest: SiteRequest): Observable<SiteCreationRequest> {
    return this.http.put<SiteCreationRequest>(this.url + '/cancel/' + siteRequest.id, siteRequest);
  }

  deleteAttachedFile(fileId: string[]): Observable<string> {
    const params: HttpParams = new HttpParams().append('fileId', fileId.toString());
    return this.http.delete<string>(this.url + '/attachedFiles', { params });
  }

  downloadAttachedFiles(fileId: number): Observable<Blob> {
    // const params: HttpParams = new HttpParams().set('fileId', fileId);
    // @ts-ignore
    return this.http.get<Blob>(this.url + '/download-attached-files/' + fileId, { responseType: 'blob' });
  }
}
