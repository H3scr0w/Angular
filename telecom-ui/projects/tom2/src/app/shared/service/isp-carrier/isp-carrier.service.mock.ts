import { of, Observable } from 'rxjs';
import { IspCarrier } from '../../models/isp-carrier';
import { Page } from '../../models/page.model';
import { IIspCarrierService } from './isp-carrier.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockIspCarrierService implements IIspCarrierService {
  getAllIspCarriers(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<IspCarrier>> {
    return of(null);
  }

  getIspCarrier(id: number): Observable<IspCarrier> {
    throw new Error('Method not implemented.');
  }
  addIspCarrier(ispCarrier: IspCarrier): Observable<IspCarrier> {
    throw new Error('Method not implemented.');
  }
  editIspCarrier(ispCarrier: IspCarrier): Observable<IspCarrier> {
    throw new Error('Method not implemented.');
  }
}
