import { of, Observable } from 'rxjs';
import { Chargeback, ChargebackFilter } from '../../models/chargeback';
import { Page } from '../../models/page.model';
import { IChargebackService } from './chargeback.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockChargebackService implements IChargebackService {
  getAllChargebacks(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: Sort,
    search?: string,
    chargebackFilter?: ChargebackFilter
  ): Observable<Page<Chargeback>> {
    return of(null);
  }

  addChargeback(chargeback: Chargeback): Observable<Chargeback> {
    return of(null);
  }

  getChargebackById(id: number): Observable<Chargeback> {
    return of(null);
  }
}
