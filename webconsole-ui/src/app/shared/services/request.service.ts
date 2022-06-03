import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Deployment } from '../models/deployment.model';
import { Request } from '../models/request.model';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private url = '/request';

  constructor(private http: HttpClient) {}

  validate(request: Request): Observable<Deployment> {
    return this.http.post<Deployment>(this.url, request);
  }
}
