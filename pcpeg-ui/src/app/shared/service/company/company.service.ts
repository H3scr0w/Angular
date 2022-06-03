import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FundModel } from './../../models/fund.model';

import { SortDirection } from '@angular/material/sort';
import { CompanySettingModel } from '../../models/company-setting.model';
import { CompanyModel } from '../../models/company.model';
import { Page } from '../../models/page.model';

export interface ICompanyService {
  updateCompany(company: CompanyModel): Observable<CompanyModel>;

  deleteCompany(societeSid: number): Observable<CompanyModel>;

  addComment(company: CompanyModel): Observable<string>;

  addCompany(company: CompanyModel): Observable<CompanyModel>;

  downloadCompanies(): Observable<Blob>;

  getFlagAdherentCompanies(): Observable<number>;

  getAllCompanies(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<CompanyModel>>;

  getCompanySettingsByIdAndPaymentType(societeSid: number, paymentTypeId: number): Observable<CompanySettingModel>;

  validateCompanySettingsByIdAndPaymentType(
    societeSid: number,
    paymentTypeId: number,
    companySetting: FormData
  ): Observable<CompanySettingModel>;

  validateCompanySettings(societeSid: number): Observable<void>;

  createOrUpdateFund(societeSid: number, paymentTypeId: number, fund: FundModel): Observable<FundModel>;

  downloadDocument(societeSid: number, documentId: number): Observable<Blob>;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService implements ICompanyService {
  private url = '/companies';

  constructor(private http: HttpClient) {}

  public getAllCompanies(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<CompanyModel>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }
    return this.http.get<Page<CompanyModel>>(this.url, { params });
  }

  addCompany(company: CompanyModel): Observable<CompanyModel> {
    return this.http.post<CompanyModel>(this.url, company);
  }

  updateCompany(company: CompanyModel): Observable<CompanyModel> {
    return this.http.put<CompanyModel>(this.url + '/' + company.societeSid, company);
  }

  deleteCompany(societeSid: number): Observable<CompanyModel> {
    return this.http.delete<CompanyModel>(this.url + '/' + societeSid);
  }

  downloadCompanies(): Observable<Blob> {
    return this.http.get(this.url + '/download', { responseType: 'blob' });
  }

  addComment(company: CompanyModel): Observable<string> {
    return this.http.put<string>(this.url + '/' + company.societeSid + '/comment', company.comments);
  }

  getFlagAdherentCompanies(): Observable<number> {
    return this.http.get<number>(this.url + '/adherents-count');
  }

  getCompanySettingsByIdAndPaymentType(societeSid: number, paymentTypeId: number): Observable<CompanySettingModel> {
    return this.http.get<CompanySettingModel>(this.url + `/settings/${societeSid}/paymentTypes/${paymentTypeId}`);
  }

  validateCompanySettingsByIdAndPaymentType(
    societeSid: number,
    paymentTypeId: number,
    companySetting: FormData
  ): Observable<CompanySettingModel> {
    return this.http.post<CompanySettingModel>(
      this.url + `/settings/${societeSid}/paymentTypes/${paymentTypeId}`,
      companySetting
    );
  }

  validateCompanySettings(societeSid: number): Observable<void> {
    return this.http.post<void>(this.url + `/settings/${societeSid}/validate`, null);
  }

  createOrUpdateFund(societeSid: number, paymentTypeId: number, fund: FundModel): Observable<FundModel> {
    return this.http.post<FundModel>(this.url + `/settings/${societeSid}/paymentTypes/${paymentTypeId}/fund`, fund);
  }

  downloadDocument(societeSid: number, documentId: number): Observable<Blob> {
    const headers: HttpHeaders = new HttpHeaders().set('X-Skip-Error-Interceptor', 'true');
    return this.http.get(this.url + `/settings/${societeSid}/documents/${documentId}/download`, {
      responseType: 'blob',
      headers
    });
  }
}
