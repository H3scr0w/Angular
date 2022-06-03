import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { City, CityFilter } from '../../models/city';
import { Page } from '../../models/page.model';
export interface ICityService {
  getAllCities(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    cityFilter?: CityFilter
  ): Observable<Page<City>>;

  addCity(city: City): Observable<City>;

  editCity(city: City): Observable<City>;

  deleteCity(id: number): Observable<City>;

  recoverCity(city: City): Observable<City>;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private url = '/cities';

  constructor(private http: HttpClient) {}

  getAllCities(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    cityFilter?: CityFilter
  ): Observable<Page<City>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (cityFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (cityFilter.name) {
        params = params.set('name', '' + cityFilter.name.trim());
      }
      if (cityFilter.country != null && cityFilter.country.id) {
        params = params.set('countryId', '' + cityFilter.country.id);
      }
      if (cityFilter.showArchived) {
        params = params.set('showArchived', '' + cityFilter.showArchived);
      }
      if (cityFilter.skip) {
        params = params.set('skip', '' + cityFilter.skip);
      }
    }

    return this.http.get<Page<City>>(this.url, { params });
  }

  addCity(city: City): Observable<City> {
    return this.http.post<City>(this.url, city);
  }

  editCity(city: City): Observable<City> {
    return this.http.put<City>(this.url + '/' + city.id, city);
  }

  deleteCity(id: number): Observable<City> {
    return this.http.delete<City>(this.url + '/' + id);
  }

  recoverCity(city: City): Observable<City> {
    return this.http.put<City>(this.url + '/recover/' + city.id, city);
  }

  getCity(name: string): Observable<City> {
    const params: HttpParams = new HttpParams().set('name', '' + name);
    return this.http.get<City>(this.url + '/getCity', { params });
  }
}
