import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestCancellation } from '../../models/request-cancellation';

export interface IRequestCancellationService {
  cancelRequest(requestCancellation: RequestCancellation): Observable<RequestCancellation>;
}

@Injectable({
  providedIn: 'root'
})
export class CancellationRequestService implements IRequestCancellationService {
  private url = '/requests';

  constructor(private http: HttpClient) {}

  cancelRequest(requestCancellation: RequestCancellation): Observable<RequestCancellation> {
    return this.http.post<RequestCancellation>(this.url + '/cancel/', requestCancellation);
  }
}
