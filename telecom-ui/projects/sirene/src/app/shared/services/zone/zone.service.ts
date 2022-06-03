import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { of, Observable } from 'rxjs';
import { Page } from '../../models/page.model';
import { Zone, ZoneFilter } from '../../models/zone';
import { ZoneHome } from '../../models/zone-home';

export interface IZoneService {
  getAllZonesSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<ZoneHome>>;

  getZonesBySector(sectorID: string): Observable<Zone[]>;

  getAllZones(
    search?: string,
    index?: number,
    size?: number,
    sectorId?: string,
    sortField?: string,
    sortDirection?: SortDirection,
    zoneFilter?: ZoneFilter
  ): Observable<Page<Zone>>;

  addZone(zone: Zone): Observable<Zone>;
  editZone(zone: Zone): Observable<Zone>;
  deleteZone(id: string): Observable<Zone>;
  recoverZone(zone: Zone): Observable<Zone>;
}

@Injectable({
  providedIn: 'root'
})
export class ZoneService implements IZoneService {
  private _url = '/zones';
  private siteCounturl = this.url + '/sites-count';

  constructor(private http: HttpClient) {}

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    if (!value) {
      this._url = '/zones';
    } else {
      this._url = value;
    }
  }

  getAllZonesSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<ZoneHome>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<ZoneHome>>(this.siteCounturl, { params });
  }

  getZonesBySector(sectorID: string): Observable<Zone[]> {
    if (!sectorID) {
      const zone: Zone[] = [];
      return of(zone);
    }
    return this.http.get<Zone[]>(this.url + '/sector-id/' + sectorID);
  }

  getAllZones(
    search?: string,
    index?: number,
    size?: number,
    sectorId?: string,
    sortField?: string,
    sortDirection?: SortDirection,
    zoneFilter?: ZoneFilter
  ): Observable<Page<Zone>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    if (sectorId) {
      params = params.set('sectorId', `${sectorId}`);
    }

    if (zoneFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (zoneFilter.id) {
        params = params.set('id', '' + zoneFilter.id.trim());
      }
      if (zoneFilter.name) {
        params = params.set('zoneName', '' + zoneFilter.name.trim());
      }
      if (zoneFilter.sector && zoneFilter.sector.id) {
        params = params.set('sectorId', '' + zoneFilter.sector.id);
      }
      if (zoneFilter.showArchived) {
        params = params.set('showArchived', '' + zoneFilter.showArchived);
      }
    }

    return this.http.get<Page<Zone>>(this.url, { params });
  }

  addZone(zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(this.url, zone);
  }

  editZone(zone: Zone): Observable<Zone> {
    return this.http.put<Zone>(this.url + '/' + zone.id, zone);
  }

  deleteZone(id: string): Observable<Zone> {
    return this.http.delete<Zone>(this.url + '/' + id);
  }

  recoverZone(zone: Zone): Observable<Zone> {
    return this.http.put<Zone>(this.url + '/recover/' + zone.id, zone);
  }
}
