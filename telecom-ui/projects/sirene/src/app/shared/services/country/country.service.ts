import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs/internal/Observable';
import { Country, CountryFilter } from '../../models/country';
import { CountryHome } from '../../models/country-home';
import { Page } from '../../models/page.model';

export interface ICountryService {
  getAllCountriesSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<CountryHome>>;

  getAllCountries(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<Country>>;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService implements ICountryService {
  private _url = '/countries';

  constructor(private http: HttpClient) {}

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    if (!value) {
      this._url = '/countries';
    } else {
      this._url = value;
    }
  }

  getAllCountriesSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<CountryHome>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<CountryHome>>(this.url + '/sites-count', { params });
  }

  getAllCountries(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: 'asc' | 'desc' | '',
    countryFilter?: CountryFilter
  ): Observable<Page<Country>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    } else if (countryFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (countryFilter.id) {
        params = params.set('id', '' + countryFilter.id.trim());
      }
      if (countryFilter.name) {
        params = params.set('name', '' + countryFilter.name.trim());
      }
      if (countryFilter.lastUser) {
        params = params.set('lastUser', '' + countryFilter.lastUser.trim());
      }
      if (countryFilter.delegation) {
        params = params.set('delegationId', '' + countryFilter.delegation.id.trim());
      }
      if (countryFilter.showArchived) {
        params = params.set('showArchived', '' + countryFilter.showArchived);
      }
      if (countryFilter.skip) {
        params = params.set('skip', '' + countryFilter.skip);
      }
    }
    return this.http.get<Page<Country>>(this.url, { params });
  }

  addCountry(country: Country): Observable<Country> {
    return this.http.post<Country>(this.url, country);
  }

  editCountry(country: Country): Observable<Country> {
    return this.http.put<Country>(this.url + '/' + country.id, country);
  }

  deleteCountry(id: string): Observable<Country> {
    return this.http.delete<Country>(this.url + '/' + id);
  }

  recoverCountry(country: Country): Observable<Country> {
    return this.http.put<Country>(this.url + '/recover/' + country.id, country);
  }
}
