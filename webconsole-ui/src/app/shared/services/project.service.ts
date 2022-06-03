import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private url = '/projects';

  constructor(private http: HttpClient) {}

  getAllUsers(
    projectType: string,
    projectCode: string,
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

    return this.http.get<Page<User>>(this.url + '/' + projectType + '/' + projectCode + '/users', { params });
  }
}
