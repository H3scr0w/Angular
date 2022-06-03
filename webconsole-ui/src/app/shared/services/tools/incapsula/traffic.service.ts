import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { IncapsulaResponse, StatsNames } from '../../../models/tools/incapsula/incapsula-data.model';

@Injectable({
  providedIn: 'root'
})
export class TrafficService {
  private url = '/tools/incapsula/sites';

  constructor(private http: HttpClient) {}

  getBandwithTimesSeries(
    domainCode: string,
    timeRange?: string,
    index?: number,
    size?: number
  ): Observable<IncapsulaResponse> {
    const statsId: string = StatsNames.bandwidth_timeseries;
    return this.getStats(domainCode, statsId, timeRange, index, size);
  }

  getCaching(domainCode: string, timeRange?: string, index?: number, size?: number): Observable<IncapsulaResponse> {
    const statsId: string = StatsNames.caching;
    return this.getStats(domainCode, statsId, timeRange, index, size);
  }

  getCachingTimesSeries(
    domainCode: string,
    timeRange?: string,
    index?: number,
    size?: number
  ): Observable<IncapsulaResponse> {
    const statsId: string = StatsNames.caching_timeseries;
    return this.getStats(domainCode, statsId, timeRange, index, size);
  }

  getHitsTimesSeries(
    domainCode: string,
    timeRange?: string,
    index?: number,
    size?: number
  ): Observable<IncapsulaResponse> {
    const statsId: string = StatsNames.hits_timeseries;
    return this.getStats(domainCode, statsId, timeRange, index, size);
  }

  getIncapRules(domainCode: string, timeRange?: string, index?: number, size?: number): Observable<IncapsulaResponse> {
    const statsId: string = StatsNames.incap_rules;
    return this.getStats(domainCode, statsId, timeRange, index, size);
  }

  getIncapRulesTimesSeries(
    domainCode: string,
    timeRange?: string,
    index?: number,
    size?: number
  ): Observable<IncapsulaResponse> {
    const statsId: string = StatsNames.incap_rules_timeseries;
    return this.getStats(domainCode, statsId, timeRange, index, size);
  }

  getRequestsGeoDistSummary(
    domainCode: string,
    timeRange?: string,
    index?: number,
    size?: number
  ): Observable<IncapsulaResponse> {
    const statsId: string = StatsNames.requests_geo_dist_summary;
    return this.getStats(domainCode, statsId, timeRange, index, size);
  }

  getThreats(domainCode: string, timeRange?: string, index?: number, size?: number): Observable<IncapsulaResponse> {
    const statsId: string = StatsNames.threats;
    return this.getStats(domainCode, statsId, timeRange, index, size);
  }

  getVisitsTimesSeries(
    domainCode: string,
    timeRange?: string,
    index?: number,
    size?: number
  ): Observable<IncapsulaResponse> {
    const statsId: string = StatsNames.visits_timeseries;
    return this.getStats(domainCode, statsId, timeRange, index, size);
  }

  getVisitsDistSummary(
    domainCode: string,
    timeRange?: string,
    index?: number,
    size?: number
  ): Observable<IncapsulaResponse> {
    const statsId: string = StatsNames.visits_dist_summary;
    return this.getStats(domainCode, statsId, timeRange, index, size);
  }

  getAllVisits(domainCode: string, timeRange?: string, index?: number, size?: number): Observable<IncapsulaResponse> {
    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (timeRange) {
      params = params.set('timeRange', timeRange);
    }

    return this.http.get<IncapsulaResponse>(this.url + '/' + domainCode + '/visits', { params });
  }

  private getStats(
    domainCode: string,
    statsId: string,
    timeRange?: string,
    index?: number,
    size?: number
  ): Observable<IncapsulaResponse> {
    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (timeRange) {
      params = params.set('timeRange', timeRange);
    }

    return this.http.get<IncapsulaResponse>(this.url + '/' + domainCode + '/stats/' + statsId, { params });
  }
}
