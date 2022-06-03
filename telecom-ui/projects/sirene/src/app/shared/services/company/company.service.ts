import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { of, Observable } from 'rxjs';
import { Company, CompanyFilter } from '../../models/company';
import { CompanyHome } from '../../models/company-home';
import { Page } from '../../models/page.model';

export interface ICompanyService {
  getAllCompaniesSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<CompanyHome>>;

  getAllCompanies(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection
  ): Observable<Page<Company>>;

  getCompanyById(sifCode: string): Observable<Company>;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService implements ICompanyService {
  private _url = '/companies';

  constructor(private http: HttpClient) {}

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    if (!value) {
      this._url = '/companies';
    } else {
      this._url = value;
    }
  }

  getAllCompaniesSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<CompanyHome>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<CompanyHome>>(this.url + '/sites-count', { params });
  }

  getAllCompanies(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    companyFilter?: CompanyFilter
  ): Observable<Page<Company>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    } else if (companyFilter) {
      params = params.set('isAdvanceFilter', 'true');
      if (companyFilter.sifCode) {
        params = params.set('sifCode', '' + companyFilter.sifCode.trim());
      }
      if (companyFilter.companyName) {
        params = params.set('name', '' + companyFilter.companyName.trim());
      }
      if (companyFilter.sector && companyFilter.sector.id) {
        params = params.set('sectorId', '' + companyFilter.sector.id.trim());
      }
      if (companyFilter.zone && companyFilter.zone.id) {
        params = params.set('zoneId', '' + companyFilter.zone.id.trim());
      }
      if (companyFilter.showArchived) {
        params = params.set('showArchived', '' + companyFilter.showArchived);
      }
      if (companyFilter.skip) {
        params = params.set('skip', '' + companyFilter.skip);
      }
      if (companyFilter.withoutSites) {
        params = params.set('withoutSites', '' + companyFilter.withoutSites);
      }
    }

    return this.http.get<Page<Company>>(this.url, { params });
  }

  getCompanyById(sifCode: string): Observable<Company> {
    if (!sifCode) {
      const company: Company = new Company();
      return of(company);
    }
    return this.http.get<Company>(this.url + '/' + sifCode);
  }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.url, company);
  }

  editCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(this.url + '/' + company.sifCode, company);
  }

  deleteCompany(company: Company): Observable<Company> {
    return this.http.delete<Company>(this.url + '/' + company.sifCode);
  }

  recoverCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(this.url + '/recover/' + company.sifCode, company);
  }

  exportExcel(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    companyFilter?: CompanyFilter
  ): Observable<Blob> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (search) {
      params = params.set('search', `${search}`);
    } else if (companyFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (companyFilter.sifCode) {
        params = params.set('sifCode', '' + companyFilter.sifCode.trim());
      }
      if (companyFilter.companyName) {
        params = params.set('name', '' + companyFilter.companyName.trim());
      }
      if (companyFilter.sector) {
        params = params.set('sectorId', '' + companyFilter.sector.id.trim());
      }
      if (companyFilter.zone) {
        params = params.set('zoneId', '' + companyFilter.zone.id.trim());
      }
      if (companyFilter.showArchived) {
        params = params.set('showArchived', '' + companyFilter.showArchived);
      }
    }

    return this.http.get(this.url + '/download', { params, responseType: 'blob' });
  }
}
