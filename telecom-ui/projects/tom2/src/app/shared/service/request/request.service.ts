import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { of, Observable } from 'rxjs';
import { Contact } from '../../models/contact';
import { EmailRequestDto } from '../../models/email-request-dto';
import { IdName } from '../../models/id-name';
import { ImportExcelError } from '../../models/import-excel-error';
import { KeyValue } from '../../models/key-value';
import { Page } from '../../models/page.model';
import { Request, RequestFilter, RequestItem, RequestOperatorItem } from '../../models/request';
import {
  RequestCancellation,
  RequestCancellationDTO,
  RequestCancellationFilter
} from '../../models/request-cancellation';

export interface IRequestService {
  getRequestTypes(): IdName[];

  getStatuses(): IdName[];

  getPriorities(): KeyValue[];

  getEligibilityResponses(): IdName[];

  getManagementModes(): KeyValue[];

  getActions(): IdName[];

  getServices(): KeyValue[];

  getAllRequestCancellations(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    requestCancellationFilter?: RequestCancellationFilter
  ): Observable<Page<RequestCancellationDTO>>;

  getAllRequestItems(requestId: number): Observable<RequestItem[]>;

  getAllRequestOperatorItems(requestId: number): Observable<RequestOperatorItem[]>;

  getCancellationFollowUpRequest(id: string): Observable<RequestCancellation>;

  addRequest(request: Request): Observable<Request>;

  editRequest(request: Request): Observable<Request>;

  addRequestOperatorItems(requestOperatorItems: RequestOperatorItem[]): Observable<RequestOperatorItem[]>;

  addRequestItems(requestItems: RequestItem[]): Observable<RequestItem[]>;

  deleteCancellationFollowUpRequest(id: string): Observable<RequestCancellation>;

  validateCancellationFollowUpRequest(requestCancellation: RequestCancellation): Observable<RequestCancellation>;

  validateAndUpload(fileToUpload: File): Observable<ImportExcelError[]>;

  getAllRequests(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: RequestFilter
  ): Observable<Page<Request>>;

  getAllRequesters(): Observable<Contact[]>;
  getOperatorEmails(requestIds: number[]): Observable<EmailRequestDto[]>;
  sendEmails(requestIds: number[], isStatusUpdate: boolean): Observable<EmailRequestDto[]>;
  download(requestId: number): Observable<Blob>;
  getAllCancelRequesters(): Observable<Contact[]>;
  getRequestById(id: number): Observable<Request>;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService implements IRequestService {
  private url = '/requests';

  constructor(private http: HttpClient) {}

  getRequestTypes(): IdName[] {
    const requestTypes: IdName[] = [];
    requestTypes.push({ id: 1, name: 'Quotation' });
    requestTypes.push({ id: 2, name: 'Eligibility' });
    requestTypes.push({ id: 3, name: 'Eligibility & Quotation' });
    requestTypes.push({ id: 4, name: 'Order' });
    requestTypes.push({ id: 5, name: 'Termination' });
    requestTypes.push({ id: 7, name: 'Device' });

    return requestTypes;
  }

  getStatuses(): IdName[] {
    const requestStatus: IdName[] = [];
    requestStatus.push({ id: 1, name: 'Pending' });
    requestStatus.push({ id: 2, name: 'Waiting Operator Response' });
    requestStatus.push({ id: 3, name: 'Ready To Order' });
    requestStatus.push({ id: 4, name: 'Validated To Order' });
    requestStatus.push({ id: 5, name: 'Ordered' });
    requestStatus.push({ id: 6, name: 'Cancelled' });
    requestStatus.push({ id: 7, name: 'Quotation not used' });

    return requestStatus;
  }

  getPriorities(): KeyValue[] {
    const priorities: KeyValue[] = [];
    priorities.push({ key: 'normal', value: 'Normal' });
    priorities.push({ key: 'high', value: 'High' });

    return priorities;
  }

  getEligibilityResponses(): IdName[] {
    const eligibilityResponses: IdName[] = [];
    eligibilityResponses.push({ id: 1, name: 'OK' });
    eligibilityResponses.push({ id: 0, name: 'KO' });
    eligibilityResponses.push({ id: 2, name: 'NOT USED' });

    return eligibilityResponses;
  }

  getManagementModes(): KeyValue[] {
    const managementModes: KeyValue[] = [];
    managementModes.push({ key: 'Run mode', value: 'Run mode' });
    managementModes.push({ key: 'Project mode', value: 'Project mode' });
    managementModes.push({ key: 'Admin mode', value: 'Admin mode' });
    managementModes.push({ key: 'IPT mode', value: 'IPT mode' });

    return managementModes;
  }

  getActions(): IdName[] {
    const actions: IdName[] = [];
    actions.push({ id: 0, name: 'Creation' });
    actions.push({ id: 1, name: 'Change' });
    actions.push({ id: 2, name: 'Termination' });
    actions.push({ id: 3, name: 'Cancellation' });
    actions.push({ id: 4, name: 'Admin' });

    return actions;
  }

  getServices(): KeyValue[] {
    const services: KeyValue[] = [];
    services.push({ key: 'S1', value: 'S1' });
    services.push({ key: 'S2', value: 'S2' });
    services.push({ key: 'S3', value: 'S3' });
    services.push({ key: 'S4', value: 'S4' });
    services.push({ key: 'S5', value: 'S5' });

    return services;
  }

  getAllRequestCancellations(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    requestCancellationFilter?: RequestCancellationFilter
  ): Observable<Page<RequestCancellationDTO>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (requestCancellationFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (requestCancellationFilter.orderId) {
        params = params.set('orderId', '' + requestCancellationFilter.orderId.trim());
      }
      if (requestCancellationFilter.status != null) {
        params = params.set('status', '' + requestCancellationFilter.status);
      }
      if (requestCancellationFilter.requester != null) {
        params = params.set('requesterId', '' + requestCancellationFilter.requester.id);
      }
    }
    return this.http.get<Page<RequestCancellationDTO>>(this.url + '/cancelled', { params });
  }

  addRequest(request: Request): Observable<Request> {
    return this.http.post<Request>(this.url, request);
  }

  editRequest(request: Request): Observable<Request> {
    return this.http.put<Request>(this.url + '/' + request.id, request);
  }

  addRequestOperatorItems(requestOperatorItems: RequestOperatorItem[]): Observable<RequestOperatorItem[]> {
    if (!requestOperatorItems || requestOperatorItems.length === 0) {
      return of(null);
    }
    return this.http.post<RequestOperatorItem[]>(this.url + '/operator-items', requestOperatorItems);
  }

  addRequestItems(requestItems: RequestItem[]): Observable<RequestItem[]> {
    if (!requestItems || requestItems.length === 0) {
      return of(null);
    }
    return this.http.post<RequestItem[]>(this.url + '/items/list', requestItems);
  }

  getCancellationFollowUpRequest(id: string): Observable<RequestCancellation> {
    return this.http.get<RequestCancellation>(this.url + '/cancelled/' + id);
  }

  deleteCancellationFollowUpRequest(id: string): Observable<RequestCancellation> {
    return this.http.delete<RequestCancellation>(this.url + '/cancelled/' + id);
  }

  validateCancellationFollowUpRequest(requestCancellation: RequestCancellation): Observable<RequestCancellation> {
    return this.http.put<RequestCancellation>(
      this.url + '/cancelled/validate/' + requestCancellation.orderId,
      requestCancellation
    );
  }

  validateAndUpload(fileToUpload: File): Observable<ImportExcelError[]> {
    const url = `${this.url}/import-operator-response`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<ImportExcelError[]>(url, formData);
  }

  download(requestId: number): Observable<Blob> {
    const params: HttpParams = new HttpParams().set('requestId', '' + requestId);
    return this.http.get(this.url + '/download', { params, responseType: 'blob' });
  }

  getAllRequesters(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url + '/requesters');
  }

  getAllRequests(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: RequestFilter
  ): Observable<Page<Request>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (advancefilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (advancefilter.requestId) {
        params = params.set('requestId', '' + advancefilter.requestId);
      }
      if (advancefilter.status) {
        params = params.set('statuses', '' + advancefilter.status);
      }
      if (advancefilter.operatorId) {
        params = params.set('operatorIds', '' + advancefilter.operatorId);
      }
      if (advancefilter.requesterId) {
        params = params.set('requesterIds', '' + advancefilter.requesterId);
      }
      if (advancefilter.rsmId) {
        params = params.set('rsmIds', '' + advancefilter.rsmId);
      }
      if (advancefilter.sectorId) {
        params = params.set('sectorIds', '' + advancefilter.sectorId);
      }
      if (advancefilter.zoneId) {
        params = params.set('zoneIds', '' + advancefilter.zoneId);
      }
      if (advancefilter.companyId) {
        params = params.set('companyIds', '' + advancefilter.companyId);
      }
      if (advancefilter.country) {
        params = params.set('country', '' + advancefilter.country);
      }
      if (advancefilter.priority) {
        params = params.set('priority', '' + advancefilter.priority);
      }
      if (advancefilter.requestTypeId) {
        params = params.set('requestTypeId', '' + advancefilter.requestTypeId);
      }
      if (advancefilter.sgtSiteCode) {
        params = params.set('siteCode', '' + advancefilter.sgtSiteCode);
      }
    }
    return this.http.get<Page<Request>>(this.url, { params });
  }

  getAllRequestItems(requestId: number): Observable<RequestItem[]> {
    return this.http.get<RequestItem[]>(this.url + '/items/' + requestId);
  }

  getAllRequestOperatorItems(requestId: number): Observable<RequestOperatorItem[]> {
    return this.http.get<RequestOperatorItem[]>(this.url + '/operator-items/' + requestId);
  }

  getOperatorEmails(requestIds: number[]): Observable<EmailRequestDto[]> {
    const params: HttpParams = new HttpParams().set('requestIds', '' + requestIds);
    return this.http.get<EmailRequestDto[]>(this.url + '/operator-emails', { params });
  }

  sendEmails(requestIds: number[], isStatusUpdate: boolean = true): Observable<EmailRequestDto[]> {
    let params: HttpParams = new HttpParams().set('requestIds', '' + requestIds.toString());
    if (isStatusUpdate) {
      params = params.set('isStatusUpdate', '' + isStatusUpdate);
    }
    return this.http.get<EmailRequestDto[]>(this.url + '/send-emails', { params });
  }

  sendEmailRequests(emails: EmailRequestDto[], isStatusUpdate: boolean = true): Observable<EmailRequestDto[]> {
    let params: HttpParams = new HttpParams();
    if (isStatusUpdate) {
      params = params.set('isStatusUpdate', '' + isStatusUpdate);
    }
    return this.http.post<EmailRequestDto[]>(this.url + '/send-emails', emails, { params });
  }

  getAllCancelRequesters(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url + '/cancel/requesters');
  }

  getRequestById(id: number): Observable<Request> {
    return this.http.get<Request>(this.url + '/' + id);
  }
}
