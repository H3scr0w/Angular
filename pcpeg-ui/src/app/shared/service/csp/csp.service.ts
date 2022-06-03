import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CspModel } from '../../models/csp.model';

export interface ICspService {
  getAllCsp(): Observable<CspModel[]>;
}

@Injectable({
  providedIn: 'root'
})
export class CspService implements ICspService {
  private url = '/csp';

  constructor(private http: HttpClient) {}

  getAllCsp(): Observable<CspModel[]> {
    return this.http.get<CspModel[]>(this.url);
  }
}
