import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Page } from '@shared';
import { Observable } from 'rxjs';
import { Profile } from '../../models/profile';

export interface IProfileService {
  getAllProfiles(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<Profile>>;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService implements IProfileService {
  private url = '/common/profiles';

  constructor(private http: HttpClient) {}

  getAllProfiles(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<Profile>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<Profile>>(this.url, { params });
  }
}
