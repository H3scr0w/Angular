import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Page } from '../../models/page.model';
import { Zone, ZoneFilter } from '../../models/zone';
import { ZoneHome } from '../../models/zone-home';
import { IZoneService } from './zone.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockZoneService implements IZoneService {
  getAllZonesSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<ZoneHome>> {
    return of(null);
  }

  getAllZones(
    search?: string,
    index?: number,
    size?: number,
    sectorId?: string,
    sortField?: string,
    sortDirection?: Sort.Asc | Sort.Desc | '',
    zoneFilter?: ZoneFilter
  ): Observable<Page<Zone>> {
    return of(null);
  }

  getZonesBySector(sectorID: string): Observable<Zone[]> {
    return of(null);
  }

  addZone(zone: Zone): Observable<Zone> {
    return of(null);
  }
  deleteZone(id: string): Observable<Zone> {
    return of(null);
  }
  editZone(zone: Zone): Observable<Zone> {
    return of(null);
  }
  recoverZone(zone: Zone): Observable<Zone> {
    return of(null);
  }
}
