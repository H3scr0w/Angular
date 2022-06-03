import { Page } from '@shared';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { SiteModificationRequest } from '../../models/site-modification-request';
import { SiteRequest } from '../../models/site-request';
import { SupervisorRequestFilter } from '../../models/supervisor-request';
import { ISiteModificationRequestService } from './site-modification-request.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockSiteModificationRequestService implements ISiteModificationRequestService {
  getAllSiteModificationRequest(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    supervisorRequestFilter?: SupervisorRequestFilter
  ): Observable<Page<SiteRequest>> {
    return of(null);
  }
  getSiteModificationRequestById(id: number): Observable<SiteModificationRequest> {
    throw new Error('Method not implemented.');
  }
  createSiteModificationRequest(siteDeletionRequest: SiteModificationRequest): Observable<SiteModificationRequest> {
    throw new Error('Method not implemented.');
  }
  validateSiteModificationRequest(siteDeletionRequest: SiteModificationRequest): Observable<SiteModificationRequest> {
    throw new Error('Method not implemented.');
  }
  cancelSiteModificationRequest(siteRequest: SiteRequest): Observable<SiteModificationRequest> {
    throw new Error('Method not implemented.');
  }
}
