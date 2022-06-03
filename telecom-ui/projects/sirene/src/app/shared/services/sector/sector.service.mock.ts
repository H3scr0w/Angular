import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Page } from '../../models/page.model';
import { Sector } from '../../models/sector';
import { SectorHome } from '../../models/sector-home';
import { ISectorService } from './sector.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockSectorService implements ISectorService {
  addSector(sector: Sector): Observable<Sector> {
    throw new Error('Method not implemented.');
  }
  editSector(sector: Sector): Observable<Sector> {
    throw new Error('Method not implemented.');
  }
  deleteSector(id: string): Observable<Sector> {
    throw new Error('Method not implemented.');
  }
  recoverSector(sector: Sector): Observable<Sector> {
    throw new Error('Method not implemented.');
  }
  getAllSectorsSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<SectorHome>> {
    return of(null);
  }

  getAllSectors(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: Sort.Asc | Sort.Desc | ''
  ): Observable<Page<Sector>> {
    return of(null);
  }
}
