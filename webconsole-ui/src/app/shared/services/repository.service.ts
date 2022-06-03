import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RepositoryService {
  private url = '/repository';

  constructor(private http: HttpClient) {}

  // tslint:disable-next-line:no-any
  getRepository(value: string): Observable<any> {
    // tslint:disable-next-line:no-any
    return this.http.get<any>(this.url + '/' + value);
  }
}
