import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs/internal/Observable';
import { Page } from '../../models/page.model';
import { Sector, SectorFilter } from '../../models/sector';
import { SectorHome } from '../../models/sector-home';

export interface ISectorService {
  getAllSectorsSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<SectorHome>>;

  getAllSectors(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: SectorFilter
  ): Observable<Page<Sector>>;

  addSector(sector: Sector): Observable<Sector>;
  editSector(sector: Sector): Observable<Sector>;
  deleteSector(id: string): Observable<Sector>;
  recoverSector(sector: Sector): Observable<Sector>;
}

@Injectable({
  providedIn: 'root'
})
export class SectorService implements ISectorService {
  private _url = '/sectors';
  private siteCounturl = this.url + '/sites-count';

  constructor(private http: HttpClient) {}

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    if (!value) {
      this._url = '/sectors';
    } else {
      this._url = value;
    }
  }

  getAllSectorsSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<SectorHome>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<SectorHome>>(this.siteCounturl, { params });
  }

  getAllSectors(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: SectorFilter
  ): Observable<Page<Sector>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (advancefilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (advancefilter.id) {
        params = params.set('id', '' + advancefilter.id);
      }
      if (advancefilter.name) {
        params = params.set('name', '' + advancefilter.name);
      }
      if (advancefilter.showArchived) {
        params = params.set('showArchived', '' + advancefilter.showArchived);
      }
    }

    return this.http.get<Page<Sector>>(this.url, { params });
  }

  addSector(sector: Sector): Observable<Sector> {
    return this.http.post<Sector>(this.url, sector);
  }

  editSector(sector: Sector): Observable<Sector> {
    return this.http.put<Sector>(this.url + '/' + sector.id, sector);
  }

  deleteSector(id: string): Observable<Sector> {
    return this.http.delete<Sector>(this.url + '/' + id);
  }

  recoverSector(sector: Sector): Observable<Sector> {
    return this.http.put<Sector>(this.url + '/recover/' + sector.id, sector);
  }
}
