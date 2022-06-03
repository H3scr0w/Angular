import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { User } from '../models/user.model';
import { UserProject } from './../models/user-project.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = '/users';

  constructor(private http: HttpClient) {}

  getUsers(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<User>> {
    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<User>>(this.url, { params });
  }

  getUser(email: string): Observable<User> {
    return this.http.get<User>(this.url + '/' + email);
  }

  createOrUpdateUser(email: string, user: User): Observable<User> {
    return this.http.put<User>(this.url + '/' + email, user);
  }

  updateProfile(email: string, user: User): Observable<User> {
    return this.http.put<User>(this.url + '/profile/' + email, user);
  }

  getUserProjects(index?: number, size?: number, email?: string, search?: string): Observable<Page<UserProject>> {
    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<UserProject>>(this.url + '/' + email + '/projects', { params });
  }

  lockUnlock(email: string): Observable<void> {
    return this.http.put<void>(this.url + '/lock-unlock/' + email, null);
  }
}
