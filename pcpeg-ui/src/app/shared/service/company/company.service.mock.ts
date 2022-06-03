import { of, Observable } from 'rxjs';

import { SortDirection } from '@angular/material/sort';
import { CompanySettingModel } from '../../models/company-setting.model';
import { CompanyModel } from '../../models/company.model';
import { FundModel } from '../../models/fund.model';
import { Page } from '../../models/page.model';
import { ICompanyService } from './company.service';

export class MockCompanyService implements ICompanyService {
  downloadDocument(societeSid: number, documentId: number): Observable<Blob> {
    throw new Error('Method not implemented.');
  }
  getCompanySettingsByIdAndPaymentType(societeSid: number, paymentTypeId: number): Observable<CompanySettingModel> {
    throw new Error('Method not implemented.');
  }
  validateCompanySettingsByIdAndPaymentType(
    societeSid: number,
    paymentTypeId: number,
    companySetting: FormData
  ): Observable<CompanySettingModel> {
    throw new Error('Method not implemented.');
  }
  validateCompanySettings(societeSid: number): Observable<void> {
    throw new Error('Method not implemented.');
  }
  createOrUpdateFund(societeSid: number, paymentTypeId: number, fund: FundModel): Observable<FundModel> {
    throw new Error('Method not implemented.');
  }
  getFlagAdherentCompanies(): Observable<number> {
    throw new Error('Method not implemented.');
  }
  addCompany(company: CompanyModel): Observable<CompanyModel> {
    throw new Error('Method not implemented.');
  }
  downloadCompanies(): Observable<Blob> {
    throw new Error('Method not implemented.');
  }
  addComment(company: CompanyModel): Observable<string> {
    throw new Error('Method not implemented.');
  }
  updateCompany(company: CompanyModel): Observable<CompanyModel> {
    throw new Error('Method not implemented.');
  }
  deleteCompany(societeSid: number): Observable<CompanyModel> {
    throw new Error('Method not implemented.');
  }
  public getAllCompanies(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<CompanyModel>> {
    return of(null!);
  }
}
