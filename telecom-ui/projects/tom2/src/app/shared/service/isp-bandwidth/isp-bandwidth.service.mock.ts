import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { IspInformation, IspInformationFilter } from '../../models/isp-information';
import { Page } from '../../models/page.model';
import { IIspBandwidthService } from './isp-bandwidth.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockIspBandwidthService implements IIspBandwidthService {
  getIspInformationByRequest(requesId: number): Observable<IspInformation> {
    return of(null);
  }
  addIspBandwidth(ispInfo: IspInformation): Observable<IspInformation> {
    return of(null);
  }

  downloadIspInformation(orderIds: string[]): Observable<Blob> {
    return of(null);
  }

  getAllIspBandwidths(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    advancefilter?: IspInformationFilter
  ): Observable<Page<IspInformation>> {
    return of(null);
  }

  getIspInformationByOrder(orderId: string): Observable<IspInformation> {
    return of(null);
  }
}
