import { of, Observable } from 'rxjs';
import { Contact } from '../../../../../sirene/src/app/shared/models/contact';
import { Page } from '../models/page.model';
import { IDeviceService } from './device.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockDeviceService implements IDeviceService {
  getContactBySGTConnectionCode(
    sgtConnectionCode?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<Contact>> {
    return of(null);
  }
}
