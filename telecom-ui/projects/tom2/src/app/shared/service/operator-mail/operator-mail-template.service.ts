import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Networks } from '../../models/networks.model';
import { OperatorMailTemplate } from '../../models/operator-mail-template.model';
import { Page } from '../../models/page.model';

export interface IMailTemplateService {
  getAllMailTemplates(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<OperatorMailTemplate>>;

  updateMailTemplates(operatorMailTemplates: OperatorMailTemplate[]): Observable<OperatorMailTemplate[]>;

  updateMailTemplate(operatorMailTemplate: OperatorMailTemplate): Observable<OperatorMailTemplate>;

  getAllNetworks(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    networkId?: Array<number>
  ): Observable<Page<Networks>>;

  getOperatorMailTemplateByNetworkAndRequestType(
    networkId: number,
    requestType: string
  ): Observable<OperatorMailTemplate>;
}

@Injectable({
  providedIn: 'root'
})
export class OperatorMailTemplateService implements IMailTemplateService {
  private url = '/operator-mail-templates';
  private urlNetwork = '/common/networks';

  constructor(private http: HttpClient) {}

  getAllMailTemplates(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<OperatorMailTemplate>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortDirection && sortField) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<OperatorMailTemplate>>(this.url, { params });
  }

  updateMailTemplates(operatorMailTemplates: OperatorMailTemplate[]): Observable<OperatorMailTemplate[]> {
    return this.http.put<OperatorMailTemplate[]>(this.url, operatorMailTemplates);
  }

  updateMailTemplate(operatorMailTemplate: OperatorMailTemplate): Observable<OperatorMailTemplate> {
    return this.http.put<OperatorMailTemplate>(this.url + '/' + operatorMailTemplate.id, operatorMailTemplate);
  }

  getAllNetworks(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    networkIds?: number[]
  ): Observable<Page<Networks>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortDirection && sortField) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }
    if (search) {
      params = params.set('search', `${search}`);
    }
    if (networkIds) {
      params = params.append('ids', networkIds.toString());
    }
    return this.http.get<Page<Networks>>(this.urlNetwork, { params });
  }

  getOperatorMailTemplateByNetworkAndRequestType(
    networkId: number,
    requestType: string
  ): Observable<OperatorMailTemplate> {
    return this.http.get<OperatorMailTemplate>(this.url + `/networks/${networkId}/object/${requestType}`);
  }
}
