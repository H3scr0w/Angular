import { Page } from '@shared';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { SiteDeletionRequest } from '../../models/site-deletion-request';
import { SiteRequest } from '../../models/site-request';
import { SupervisorRequestFilter } from '../../models/supervisor-request';
import { ISiteDeletionRequestService } from './site-deletion-request.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockSiteDeletionRequestService implements ISiteDeletionRequestService {
  getAllSiteDeletionRequest(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    supervisorRequestFilter?: SupervisorRequestFilter
  ): Observable<Page<SiteRequest>> {
    return of(null);
  }
  getSiteDeletionRequestById(id: number): Observable<SiteDeletionRequest> {
    throw new Error('Method not implemented.');
  }
  createSiteDeletionRequest(siteDeletionRequest: SiteDeletionRequest): Observable<SiteDeletionRequest> {
    throw new Error('Method not implemented.');
  }
  validateSiteDeletionRequest(siteDeletionRequest: SiteDeletionRequest): Observable<SiteDeletionRequest> {
    throw new Error('Method not implemented.');
  }
  cancelSiteDeletionRequest(siteRequest: SiteRequest): Observable<SiteDeletionRequest> {
    throw new Error('Method not implemented.');
  }
}
