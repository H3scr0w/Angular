import { of, Observable } from 'rxjs';
import { DeviceValuesList } from '../../models/device-values-list';
import { Page } from '../../models/page.model';
import { IDeviceValuesListService } from './device-values-list.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockDeviceValuesListService implements IDeviceValuesListService {
  getDeviceValuesList(id: number): Observable<DeviceValuesList> {
    throw new Error('Method not implemented.');
  }

  addDeviceValuesList(deviceValuesList: DeviceValuesList): Observable<DeviceValuesList> {
    throw new Error('Method not implemented.');
  }
  editDeviceValuesList(deviceValuesList: DeviceValuesList): Observable<DeviceValuesList> {
    throw new Error('Method not implemented.');
  }

  getAllDeviceValuesList(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    field?: string
  ): Observable<Page<DeviceValuesList>> {
    return of(null);
  }
}
