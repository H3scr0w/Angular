import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Operator } from '../../models/operators';
import { Page } from '../../models/page.model';
import { IOperatorsService } from './operators.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockOperatorsService implements IOperatorsService {
  getAllOperators(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<Operator>> {
    return of(null);
  }

  addOperator(operator: Operator): Observable<Operator> {
    throw new Error('Method not implemented.');
  }

  editOperator(operator: Operator): Observable<Operator> {
    throw new Error('Method not implemented.');
  }

  deleteOperator(id: number): Observable<Operator> {
    throw new Error('Method not implemented.');
  }

  getOperatorById(id: number): Observable<Operator> {
    throw new Error('Method not implemented.');
  }
}
