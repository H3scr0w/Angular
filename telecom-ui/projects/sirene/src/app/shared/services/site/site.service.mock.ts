import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Contact } from '../../models/contact';
import { Page } from '../../models/page.model';
import { ReportSite } from '../../models/report-site';
import { Site, SiteFilter } from '../../models/site';
import { ISiteService } from './site.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockSiteService implements ISiteService {
  getAllSites(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Page<Site>> {
    return of(null);
  }

  getAllReportSites(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Page<ReportSite>> {
    return of(null);
  }

  getActiveRSMs(): Observable<Page<Contact>> {
    return of(null);
  }

  getSiteById(id: string): Observable<Site> {
    return of(null);
  }

  countAll(): Observable<number> {
    return of(null);
  }

  deleteSite(id: string): Observable<Site> {
    return of(null);
  }

  recoverSite(data: Site): Observable<Site> {
    return of(null);
  }

  exportExcelReportSite(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Blob> {
    return of(null);
  }

  exportExcelSite(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    siteFilter?: SiteFilter
  ): Observable<Blob> {
    return of(null);
  }

  updateBulkSites(data: import('../../models/bulk-site-dto').BulkSiteDTO): Observable<void> {
    return of(null);
  }
}
