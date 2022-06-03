import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDirectoryModel } from '../../../models/user-directory-model';

export interface IUserDirectoryService {
  getAllDirectoryUsers(sgid?: string, firstName?: string, lastName?: string): Observable<UserDirectoryModel[]>;
}

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserDirectoryService {
  private url = '/directory-users';

  constructor(private http: HttpClient) {}

  getAllDirectoryUsers(sgid?: string, firstName?: string, lastName?: string): Observable<UserDirectoryModel[]> {
    let params: HttpParams = new HttpParams();

    if (sgid) {
      params = params.set('sgid', sgid);
    }
    if (firstName) {
      params = params.set('firstName', firstName);
    }
    if (lastName) {
      params = params.set('lastName', lastName);
    }
    return this.http.get<UserDirectoryModel[]>(this.url, { params });
  }
}
