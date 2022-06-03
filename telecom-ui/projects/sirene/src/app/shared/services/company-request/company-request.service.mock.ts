import { Page } from '@shared';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { CompanyRequest } from '../../models/company-request';
import { SupervisorRequestFilter } from '../../models/supervisor-request';
import { ICompanyRequestService } from './company-request.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockCompanyRequestService implements ICompanyRequestService {
  getAllCompanyRequests(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    contactFilter?: SupervisorRequestFilter
  ): Observable<Page<CompanyRequest>> {
    return of(null);
  }

  getCompanyRequestById(id: number): Observable<CompanyRequest> {
    throw new Error('Method not implemented.');
  }
  createCompanyRequest(companyRequest: CompanyRequest): Observable<CompanyRequest> {
    throw new Error('Method not implemented.');
  }
  validateCompanyRequest(companyRequest: CompanyRequest): Observable<CompanyRequest> {
    throw new Error('Method not implemented.');
  }
  cancelCompanyRequest(companyRequest: CompanyRequest): Observable<CompanyRequest> {
    throw new Error('Method not implemented.');
  }
}
