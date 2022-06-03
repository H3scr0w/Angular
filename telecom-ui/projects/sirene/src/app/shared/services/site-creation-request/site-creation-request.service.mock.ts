import { Page } from '@shared';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { SiteCreationRequest } from '../../models/site-creation-request';
import { SiteRequest } from '../../models/site-request';
import { SupervisorRequestFilter } from '../../models/supervisor-request';
import { ISiteCreationRequestService } from './site-creation-request.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockSiteCreationRequestService implements ISiteCreationRequestService {
  getAllSiteCreationRequest(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    supervisorRequestFilter?: SupervisorRequestFilter
  ): Observable<Page<SiteRequest>> {
    return of(null);
  }
  getSiteCreationRequestById(id: number): Observable<SiteCreationRequest> {
    throw new Error('Method not implemented.');
  }
  createSiteCreationRequest(siteDeletionRequest: FormData): Observable<SiteCreationRequest> {
    throw new Error('Method not implemented.');
  }
  validateSiteCreationRequest(siteDeletionRequest: FormData, id: string): Observable<SiteCreationRequest> {
    throw new Error('Method not implemented.');
  }
  cancelSiteCreationRequest(siteRequest: SiteRequest): Observable<SiteCreationRequest> {
    throw new Error('Method not implemented.');
  }
}
