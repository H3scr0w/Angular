import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { KeyValue } from '../../models/key-value';
import { Page } from '../../models/page.model';
import { TelecomService, TelecomServiceFilter } from '../../models/telecom-service-selector';

export interface ITelecomServiceSelectorService {
  getServiceLevels(): KeyValue[];
  getServiceTypes(): KeyValue[];
  getMainOrBackupServices(): KeyValue[];
  getBackupSpecificities(): KeyValue[];
  getTelecomServices(): Observable<Page<TelecomService>>;
}

@Injectable({
  providedIn: 'root'
})
export class TelecomServiceSelectorService implements ITelecomServiceSelectorService {
  private url = '/catalogs/services';

  constructor(private http: HttpClient) {}

  getServiceLevels(): KeyValue[] {
    const serviceLevels: KeyValue[] = [];
    serviceLevels.push({ key: 'T', value: 'T - 0h < GTR <= 2h' });
    serviceLevels.push({ key: 'U', value: 'U - 2h < GTR <= 4h' });
    serviceLevels.push({ key: 'V', value: 'V - 4h < GTR <= 8h' });
    serviceLevels.push({ key: 'W', value: 'W - 8h < GTR <= 12h' });
    serviceLevels.push({ key: 'X', value: 'X - 12h < GTR <= 24h' });
    serviceLevels.push({ key: 'Y', value: 'Y - 24h < GTR <= 48h' });
    serviceLevels.push({ key: 'Z', value: 'Z - No GTR' });

    return serviceLevels;
  }

  getServiceTypes(): KeyValue[] {
    const serviceTypes: KeyValue[] = [];
    serviceTypes.push({ key: 'M', value: 'MPLS' });
    serviceTypes.push({ key: 'I', value: 'IPSEC' });
    serviceTypes.push({ key: 'X', value: 'MPLS+IPSEC' });
    serviceTypes.push({ key: 'B', value: 'Bronze Lite IP fixed' });
    serviceTypes.push({ key: 'D', value: 'Bronze Lite IP dynamic' });
    serviceTypes.push({ key: 'F', value: 'Quick Connect IP fixed' });
    serviceTypes.push({ key: 'Q', value: 'Quick Connect IP dynamic' });
    serviceTypes.push({ key: 'G', value: 'Quick Connect 3G/4G dynamic' });
    serviceTypes.push({ key: 'P', value: 'Point-to-Point' });
    serviceTypes.push({ key: 'Z', value: 'Service Management' });
    serviceTypes.push({ key: 'L', value: 'Offloading' });

    return serviceTypes;
  }

  getMainOrBackupServices(): KeyValue[] {
    const mainServices: KeyValue[] = [];
    mainServices.push({ key: 'N', value: 'No' });
    mainServices.push({ key: 'D', value: 'Data' });
    mainServices.push({ key: 'V', value: 'Voice' });
    mainServices.push({ key: 'M', value: 'Multimedia' });
    mainServices.push({ key: 'H', value: 'Half' });

    return mainServices;
  }

  getBackupSpecificities(): KeyValue[] {
    const backupSpecificities: KeyValue[] = [];
    backupSpecificities.push({ key: 'No', value: 'No Backup' });
    backupSpecificities.push({ key: '10', value: '10 : Backup, 1 Cpe, No diversity' });
    backupSpecificities.push({ key: '2P', value: '2P : Backup, 2 Cpe, Diversity 1 Pop' });
    backupSpecificities.push({ key: '2R', value: '2R : Backup, 2 Cpe, Diversity 2 DSLAM' });
    backupSpecificities.push({ key: '2S', value: '2S : Backup, 2 Cpe, Diversity 2 Pop' });
    backupSpecificities.push({ key: '2T', value: '2T : Backup, 2 Cpe, Total Diversity' });
    backupSpecificities.push({ key: 'L', value: 'L : Loadsharing' });

    return backupSpecificities;
  }

  getTelecomServices(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    telecomServiceFilter?: TelecomServiceFilter
  ): Observable<Page<TelecomService>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    } else if (telecomServiceFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (telecomServiceFilter.countryCode) {
        params = params.set('countryCode', '' + telecomServiceFilter.countryCode);
      }
      if (telecomServiceFilter.isDOMTOM) {
        params = params.set('isDOMTOM', '' + telecomServiceFilter.isDOMTOM);
      }
      if (telecomServiceFilter.operator) {
        params = params.set('operatorId', '' + telecomServiceFilter.operator);
      }
      if (telecomServiceFilter.serviceLevel) {
        params = params.set('serviceLevel', '' + telecomServiceFilter.serviceLevel);
      }
      if (telecomServiceFilter.serviceType) {
        params = params.set('serviceType', '' + telecomServiceFilter.serviceType);
      }
      if (telecomServiceFilter.mainServiceCosType) {
        params = params.set('mainCosType', '' + telecomServiceFilter.mainServiceCosType);
      }
      if (telecomServiceFilter.mainTechno) {
        params = params.set('mainTechno', '' + telecomServiceFilter.mainTechno);
      }
      if (telecomServiceFilter.bandwidthMainServiceFrom) {
        params = params.set('mainBandwithStart', '' + telecomServiceFilter.bandwidthMainServiceFrom);
      }
      if (telecomServiceFilter.bandwidthMainServiceTo) {
        params = params.set('mainBandwithEnd', '' + telecomServiceFilter.bandwidthMainServiceTo);
      }
      if (telecomServiceFilter.backupSpecificity && telecomServiceFilter.backupSpecificity.toLowerCase() !== 'no') {
        params = params.set('backupSpecifity', '' + telecomServiceFilter.backupSpecificity);
      } else if (
        telecomServiceFilter.backupSpecificity &&
        telecomServiceFilter.backupSpecificity.toLowerCase() === 'no'
      ) {
        params = params.set('noBackup', '' + true);
      } else {
        params = params.set('noBackup', '' + false);
      }
      if (telecomServiceFilter.backupServiceCosType) {
        params = params.set('backupCosType', '' + telecomServiceFilter.backupServiceCosType);
      }
      if (telecomServiceFilter.backupTechno) {
        params = params.set('backupTechno', '' + telecomServiceFilter.backupTechno);
      }
      if (telecomServiceFilter.bandwidthBackupServiceFrom) {
        params = params.set('backupBandwithStart', '' + telecomServiceFilter.bandwidthBackupServiceFrom);
      }
      if (telecomServiceFilter.bandwidthBackupServiceTo) {
        params = params.set('backupBandwithEnd', '' + telecomServiceFilter.bandwidthBackupServiceTo);
      }
      if (telecomServiceFilter.monthlyCostLte) {
        params = params.set('monthlyCostLte', '' + telecomServiceFilter.monthlyCostLte);
      }
      if (telecomServiceFilter.requestType) {
        params = params.set('requestType', '' + telecomServiceFilter.requestType);
      }
    }
    return this.http.get<Page<TelecomService>>(this.url, { params });
  }
}
