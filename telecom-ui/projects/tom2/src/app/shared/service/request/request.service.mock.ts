import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Contact } from '../../models/contact';
import { EmailRequestDto } from '../../models/email-request-dto';
import { IdName } from '../../models/id-name';
import { KeyValue } from '../../models/key-value';
import { Page } from '../../models/page.model';
import { Request, RequestFilter, RequestItem, RequestOperatorItem } from '../../models/request';
import {
  RequestCancellation,
  RequestCancellationDTO,
  RequestCancellationFilter
} from '../../models/request-cancellation';
import { IRequestService } from './request.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockRequestService implements IRequestService {
  getAllRequestItems(requestId: number): Observable<RequestItem[]> {
    throw new Error('Method not implemented.');
  }
  getAllRequestOperatorItems(requestId: number): Observable<RequestOperatorItem[]> {
    throw new Error('Method not implemented.');
  }
  cancelRequest(request: Request): Observable<Request> {
    throw new Error('Method not implemented.');
  }
  getEligibilityResponses(): IdName[] {
    const idName: IdName[] = [];
    return idName;
  }
  addRequest(request: Request): Observable<Request> {
    throw new Error('Method not implemented.');
  }
  editRequest(request: Request): Observable<Request> {
    throw new Error('Method not implemented.');
  }
  addRequestOperatorItems(requestOperatorItems: RequestOperatorItem[]): Observable<RequestOperatorItem[]> {
    throw new Error('Method not implemented.');
  }
  addRequestItems(requestItems: RequestItem[]): Observable<RequestItem[]> {
    throw new Error('Method not implemented.');
  }
  getRequestTypes(): IdName[] {
    const idName: IdName[] = [];
    return idName;
  }
  getStatuses(): IdName[] {
    const idName: IdName[] = [];
    return idName;
  }
  getPriorities(): KeyValue[] {
    const keyValue: KeyValue[] = [];
    return keyValue;
  }
  getManagementModes(): KeyValue[] {
    const keyValue: KeyValue[] = [];
    return keyValue;
  }
  getActions(): IdName[] {
    const idName: IdName[] = [];
    return idName;
  }
  getServices(): KeyValue[] {
    const keyValue: KeyValue[] = [];
    return keyValue;
  }
  getAllRequestCancellations(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    requestCancellationFilter?: RequestCancellationFilter
  ): Observable<Page<RequestCancellationDTO>> {
    return of(null);
  }

  getCancellationFollowUpRequest(id: string): Observable<RequestCancellation> {
    throw new Error('Method not implemented.');
  }

  deleteCancellationFollowUpRequest(id: string): Observable<RequestCancellation> {
    throw new Error('Method not implemented.');
  }

  validateCancellationFollowUpRequest(requestCancellation: RequestCancellation): Observable<RequestCancellation> {
    throw new Error('Method not implemented.');
  }

  validateAndUpload(fileToUpload: File): Observable<import('../../models/import-excel-error').ImportExcelError[]> {
    throw new Error('Method not implemented.');
  }

  download(requestId: number): Observable<Blob> {
    return undefined;
  }

  getAllRequesters(): Observable<Contact[]> {
    return undefined;
  }

  getAllRequests(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    advancefilter?: RequestFilter
  ): Observable<Page<Request>> {
    return of(null);
  }

  getOperatorEmails(requestIds: number[]): Observable<EmailRequestDto[]> {
    return undefined;
  }

  sendEmails(requestIds: number[], isStatusUpdate: boolean = false): Observable<EmailRequestDto[]> {
    return undefined;
  }

  getAllCancelRequesters(): Observable<Contact[]> {
    throw new Error('Method not implemented.');
  }

  getRequestById(id: number): Observable<Request> {
    return undefined;
  }
}
