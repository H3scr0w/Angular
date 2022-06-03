import { of, Observable } from 'rxjs';
import { Action } from '../../models/action';
import { Page } from '../../models/page.model';
import { IActionService } from './action.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockActionService implements IActionService {
  getAllActions(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<Action>> {
    return of(null);
  }
}
