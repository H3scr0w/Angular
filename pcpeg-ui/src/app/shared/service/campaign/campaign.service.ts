import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { CampaignFilter, CampaignModel } from '../../models/campaign.model';
import { CorrespondantModel } from '../../models/correspondant.model';
import { LaunchCampaignModel } from '../../models/launch.campaign.model';
import { Page } from '../../models/page.model';
import { YearModel } from '../../models/year.model';
import { CampaignStatsModel } from './../../models/campaign-stats.model';

export interface ICampaignService {
  getAllCompaigns(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    filter?: CampaignFilter
  ): Observable<Page<CampaignModel>>;

  getCampaignStats(year: string): Observable<CampaignStatsModel>;

  createCampaign(year: string, copyPrevious: boolean): Observable<LaunchCampaignModel>;

  replaceCorrespondant(societeId: number, year: number, sgid: string, isNotified?: boolean): Observable<void>;

  deleteCorrespondant(societeId: number, year: number): Observable<void>;

  notifyCorrespondants(correspondants: CorrespondantModel[], isReminder?: boolean): Observable<void>;

  downloadCampaigns(filter?: CampaignFilter): Observable<Blob>;

  openCampaign(year: string): Observable<YearModel>;

  closeCampaign(year: string): Observable<YearModel>;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignService implements ICampaignService {
  private url = '/campaigns';

  constructor(private http: HttpClient) {}

  getAllCompaigns(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    filter?: CampaignFilter
  ): Observable<Page<CampaignModel>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }
    if (filter) {
      if (filter.year) {
        params = params.set('year', filter.year);
      }
      if (filter.statutId && filter.statutId !== 0) {
        params = params.set('statutId', `${filter.statutId}`);
      }
    }

    return this.http.get<Page<CampaignModel>>(this.url, { params });
  }

  getCampaignStats(year: string): Observable<CampaignStatsModel> {
    return this.http.get<CampaignStatsModel>(this.url + '/stats/years/' + year);
  }

  createCampaign(year: string, copyPrevious: boolean): Observable<LaunchCampaignModel> {
    let params: HttpParams = new HttpParams();
    params = params.set('year', year);
    params = params.set('copyPrevious', '' + copyPrevious);
    return this.http.post<LaunchCampaignModel>(this.url, null, { params });
  }

  replaceCorrespondant(societeId: number, year: number, sgid: string, isNotified?: boolean): Observable<void> {
    let params: HttpParams = new HttpParams();

    if (isNotified) {
      params = params.set('isNotified', `${isNotified}`);
    }

    return this.http.post<void>(this.url + `/companies/${societeId}/years/${year}/users/${sgid}`, null, { params });
  }

  deleteCorrespondant(societeId: number, year: number): Observable<void> {
    return this.http.delete<void>(this.url + `/companies/${societeId}/years/${year}/users`);
  }

  notifyCorrespondants(correspondants: CorrespondantModel[], isReminder?: boolean): Observable<void> {
    let params: HttpParams = new HttpParams();

    if (isReminder) {
      params = params.set('isReminder', `${isReminder}`);
    }

    return this.http.post<void>(this.url + '/email', correspondants, { params });
  }

  downloadCampaigns(filter?: CampaignFilter): Observable<Blob> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      if (filter.year) {
        params = params.set('year', filter.year);
      }
      if (filter.statutId && filter.statutId !== 0) {
        params = params.set('statutId', `${filter.statutId}`);
      }
    }
    return this.http.get(this.url + '/download', { params, responseType: 'blob' });
  }

  openCampaign(year: string): Observable<YearModel> {
    return this.http.post<YearModel>(this.url + `/campaigns/years/${year}/open`, null);
  }

  closeCampaign(year: string): Observable<YearModel> {
    return this.http.post<YearModel>(this.url + `/campaigns/years/${year}/close`, null);
  }
}
