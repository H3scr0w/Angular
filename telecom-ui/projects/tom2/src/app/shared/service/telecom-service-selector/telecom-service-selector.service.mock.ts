import { of, Observable } from 'rxjs';
import { KeyValue } from '../../models/key-value';
import { Page } from '../../models/page.model';
import { TelecomService, TelecomServiceFilter } from '../../models/telecom-service-selector';
import { ITelecomServiceSelectorService } from './telecom-service-selector.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockTelecomServiceSelectorService implements ITelecomServiceSelectorService {
  getTelecomServices(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    telecomServiceFilter?: TelecomServiceFilter
  ): Observable<Page<TelecomService>> {
    return of(null);
  }

  getServiceLevels(): KeyValue[] {
    const keyValue: KeyValue[] = [];
    return keyValue;
  }

  getServiceTypes(): KeyValue[] {
    const keyValue: KeyValue[] = [];
    return keyValue;
  }

  getMainOrBackupServices(): KeyValue[] {
    const keyValue: KeyValue[] = [];
    return keyValue;
  }

  getMainTechnos(): KeyValue[] {
    const keyValue: KeyValue[] = [];
    return keyValue;
  }

  getBackupSpecificities(): KeyValue[] {
    const keyValue: KeyValue[] = [];
    return keyValue;
  }

  getBackupTechnos(): KeyValue[] {
    const keyValue: KeyValue[] = [];
    return keyValue;
  }

  getAliases(): KeyValue[] {
    const keyValue: KeyValue[] = [];
    return keyValue;
  }
}
