import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../../models/page.model';
import { OptionProfile } from '../../../models/tools/qualys/optionprofile.model';
import { Criteria } from '../../../models/tools/qualys/util/criteria.model';
import { Filters } from '../../../models/tools/qualys/util/filters.model';

@Injectable({
  providedIn: 'root'
})
export class OptionProfileService {
  private url = '/tools/qualys/profiles';

  constructor(private http: HttpClient) {}

  searchOptionProfiles(filters: Filters, index?: number, size?: number): Observable<Page<OptionProfile>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.post<Page<OptionProfile>>(this.url + '/search', filters, { params });
  }

  searchOptionProfilesByName(name: string, index?: number, size?: number): Observable<Page<OptionProfile>> {
    const criteria: Criteria = new Criteria();
    criteria.field = 'name';
    criteria.operator = 'CONTAINS';
    criteria.value = name;

    const filters: Filters = new Filters();
    filters.Criteria = [criteria];

    return this.searchOptionProfiles(filters, index, size);
  }
}
