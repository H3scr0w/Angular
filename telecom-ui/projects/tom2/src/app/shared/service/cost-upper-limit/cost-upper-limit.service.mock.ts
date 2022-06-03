import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { CostUpperLimit } from '../../models/cost-upper-limit.model';
import { Page } from '../../models/page.model';
import { ICostUpperLimitService } from './cost-upper-limit.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class CostUpperLimitServiceMock implements ICostUpperLimitService {
  getAllCostUpperLimits(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc
  ): Observable<Page<CostUpperLimit>> {
    return of(null);
  }

  updateCostUpperLimit(costUpperLimit: CostUpperLimit): Observable<CostUpperLimit> {
    throw new Error('Method not implemented.');
  }

  updateCostUpperLimits(costUpperLimit: CostUpperLimit[]): Observable<CostUpperLimit[]> {
    throw new Error('Method not implemented.');
  }
}
