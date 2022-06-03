import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { YearModel } from '../../models/year.model';

export interface IYearService {
  getYears(): Observable<YearModel[]>;
}

@Injectable({
  providedIn: 'root'
})
export class YearService implements IYearService {
  private url = '/years';

  constructor(private http: HttpClient) {}

  getYears(): Observable<YearModel[]> {
    return this.http.get<YearModel[]>(this.url);
  }
}
