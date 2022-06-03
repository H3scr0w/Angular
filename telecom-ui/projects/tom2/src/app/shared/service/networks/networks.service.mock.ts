import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Networks, NetworksFilter } from '../../models/networks.model';
import { Page } from '../../models/page.model';
import { INetworkService } from './networks.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockNetworksService implements INetworkService {
  addNetwork(sector: Networks): Observable<Networks> {
    throw new Error('Method not implemented.');
  }

  editNetwork(sector: Networks): Observable<Networks> {
    throw new Error('Method not implemented.');
  }

  getAllNetworks(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    advancefilter?: NetworksFilter
  ): Observable<Page<Networks>> {
    return of(null);
  }
}
