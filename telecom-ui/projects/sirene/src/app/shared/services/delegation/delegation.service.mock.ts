import { Delegation, DelegationFilter, Page } from '@shared';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { DelegationHome } from '../../models/delegation-home';
import { IDelegationService } from './delegation.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockDelegationService implements IDelegationService {
  addDelegation(_delegation: Delegation): Observable<Delegation> {
    throw new Error('Method not implemented.');
  }
  editDelegation(delegation: Delegation): Observable<Delegation> {
    throw new Error('Method not implemented.');
  }
  deleteDelegation(id: string): Observable<Delegation> {
    throw new Error('Method not implemented.');
  }
  recoverDelegation(delegation: Delegation): Observable<Delegation> {
    throw new Error('Method not implemented.');
  }
  getAllDelegations(
    search?: string,
    delegationFilter?: DelegationFilter,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: Sort.Asc | Sort.Desc | ''
  ): Observable<Page<Delegation>> {
    return of(null);
  }

  getAllDelegationsSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<DelegationHome>> {
    return of(null);
  }
}
