import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs/internal/Observable';
import { BulkSiteDTO } from '../../models/bulk-site-dto';
import { Contact } from '../../models/contact';
import { Page } from '../../models/page.model';
import { ReportSite } from '../../models/report-site';
import { Site, SiteFilter } from '../../models/site';

export interface ISiteService {
  getAllSites(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Page<Site>>;

  getAllReportSites(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Page<ReportSite>>;

  getActiveRSMs(): Observable<Page<Contact>>;

  getSiteById(id: string): Observable<Site>;

  countAll(): Observable<number>;

  deleteSite(id: string): Observable<Site>;

  recoverSite(data: Site): Observable<Site>;

  updateBulkSites(data: BulkSiteDTO): Observable<void>;

  exportExcelReportSite(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Blob>;

  exportExcelSite(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Blob>;
}

@Injectable({
  providedIn: 'root'
})
export class SiteService implements ISiteService {
  private _url = '/sites';

  constructor(private http: HttpClient) {}

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    if (!value) {
      this._url = '/sites';
    } else {
      this._url = value;
    }
  }

  getAllSites(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Page<Site>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    } else if (siteFilter) {
      params = params.set('isAdvanceFilter', 'true');
      if (siteFilter.showArchived) {
        params = params.set('showArchived', '' + siteFilter.showArchived);
      }
      if (siteFilter.withoutDevices) {
        params = params.set('withoutDevices', '' + siteFilter.withoutDevices);
      }
      if (siteFilter.withoutUsers) {
        params = params.set('withoutUsers', '' + siteFilter.withoutUsers);
      }
      if (siteFilter.usualName) {
        params = params.set('siteName', siteFilter.usualName.trim());
      }
      if (siteFilter.siteCodeChar) {
        params = params.set('siteCodeFrom', this.siteCode(siteFilter.siteCodeChar, siteFilter.siteCodeFrom));
        params = params.set(
          'siteCodeTo',
          siteFilter.siteCodeTo + '' !== ''
            ? this.siteCode(siteFilter.siteCodeChar, siteFilter.siteCodeTo)
            : siteFilter.siteCodeChar + '9999'
        );
      }
      if (siteFilter.sector) {
        params = params.set('sectorId', siteFilter.sector.id.trim());
      }
      if (siteFilter.zone) {
        params = params.set('zoneId', siteFilter.zone.id.trim());
      }
      if (siteFilter.company) {
        params = params.set('companyId', siteFilter.company.sifCode);
      }
      if (siteFilter.sifCode) {
        params = params.set('companyId', siteFilter.sifCode.sifCode);
      }
      if (siteFilter.country) {
        params = params.set('countryId', siteFilter.country.id.trim());
      }
      if (siteFilter.city) {
        params = params.set('cityId', String(siteFilter.city.id));
      }
      if (siteFilter.rsm) {
        params = params.set('rsmId', String(siteFilter.rsm.id));
      }
      if (siteFilter.backbone === 0 || siteFilter.backbone === 1) {
        params = params.set('backbone', String(siteFilter.backbone));
      }
    }
    return this.http.get<Page<Site>>(this.url, { params });
  }

  getAllReportSites(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Page<ReportSite>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (siteFilter && siteFilter.showObsolete) {
      params = params.set('showObsolete', `${siteFilter.showObsolete}`);
    }

    if (siteFilter && siteFilter.showErrors) {
      params = params.set('showErrors', `${siteFilter.showErrors}`);
    }

    return this.http.get<Page<ReportSite>>(this.url + '/reports', { params });
  }

  deleteSite(id: string): Observable<Site> {
    return this.http.delete<Site>(this.url + '/' + id);
  }

  recoverSite(data: Site): Observable<Site> {
    return this.http.put<Site>(this.url + '/recover/' + data.siteCode, data);
  }

  exportExcelReportSite(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Blob> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (siteFilter && siteFilter.showObsolete) {
      params = params.set('showObsolete', `${siteFilter.showObsolete}`);
    }

    if (siteFilter && siteFilter.showErrors) {
      params = params.set('showErrors', `${siteFilter.showErrors}`);
    }

    return this.http.get(this.url + '/reports/download', { params, responseType: 'blob' });
  }

  exportExcelSite(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Blob> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    } else if (siteFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (siteFilter.showArchived) {
        params = params.set('showArchived', '' + siteFilter.showArchived);
      }
      if (siteFilter.usualName) {
        params = params.set('siteName', siteFilter.usualName.trim());
      }
      if (siteFilter.siteCodeChar) {
        params = params.set('siteCodeFrom', this.siteCode(siteFilter.siteCodeChar, siteFilter.siteCodeFrom));
        params = params.set(
          'siteCodeTo',
          siteFilter.siteCodeTo + '' !== ''
            ? this.siteCode(siteFilter.siteCodeChar, siteFilter.siteCodeTo)
            : siteFilter.siteCodeChar + '9999'
        );
      }
      if (siteFilter.sector) {
        params = params.set('sectorId', siteFilter.sector.id.trim());
      }
      if (siteFilter.zone) {
        params = params.set('zoneId', siteFilter.zone.id.trim());
      }
      if (siteFilter.company) {
        params = params.set('companyId', siteFilter.company.sifCode);
      }
      if (siteFilter.country) {
        params = params.set('countryId', siteFilter.country.id.trim());
      }
      if (siteFilter.city) {
        params = params.set('cityId', String(siteFilter.city.id));
      }
      if (siteFilter.rsm) {
        params = params.set('rsmId', String(siteFilter.rsm.id));
      }
      if (siteFilter.backbone) {
        params = params.set('backbone', '1');
      }
    }
    return this.http.get(this.url + '/download', { params, responseType: 'blob' });
  }

  getActiveRSMs(): Observable<Page<Contact>> {
    return this.http.get<Page<Contact>>(this.url + '/rsm');
  }

  getSiteById(id: string): Observable<Site> {
    return this.http.get<Site>(this.url + '/' + id);
  }

  countAll(): Observable<number> {
    return this.http.get<number>(this.url + '/count-all');
  }

  upload(formdata: FormData, application: string, siteCode: string): Observable<string> {
    const params: HttpParams = new HttpParams().set('application', '' + application).set('siteCode', siteCode);
    return this.http.post<string>(this.url + '/attach-files', formdata, { params });
  }

  deleteAttachedFile(fileId: string[]): Observable<string> {
    const params: HttpParams = new HttpParams().append('fileId', fileId.toString());
    return this.http.delete<string>(this.url + '/attachedFiles', { params });
  }

  downloadAttachedFiles(fileId: string): Observable<Blob> {
    const params: HttpParams = new HttpParams().set('fileId', fileId);
    // @ts-ignore
    return this.http.get<Blob>(this.url + '/download-attached-files', { responseType: 'blob', params });
  }

  addSite(site: FormData): Observable<Site> {
    return this.http.post<Site>(this.url, site);
  }

  editSite(site: FormData, id: string): Observable<Site> {
    return this.http.put<Site>(this.url + '/' + id, site);
  }

  editPSTNNumber(siteCode: string, pstnNumber: string): Observable<Site> {
    return this.http.put<Site>(this.url + '/' + siteCode + '/pstnNumber/' + pstnNumber, null);
  }

  updateBulkSites(data: BulkSiteDTO): Observable<void> {
    return this.http.put<void>(this.url + '/bulk', data);
  }

  private siteCode(char: string, code: number): string {
    let finalCode: string = '' + code;
    while (finalCode.length < 4) {
      finalCode = '0' + finalCode;
    }
    return char + finalCode;
  }
}
