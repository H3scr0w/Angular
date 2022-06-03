import { Page, SiteType } from '@shared';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ISiteTypeService } from './site-type.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockSiteTypeService implements ISiteTypeService {
  getAllSiteTypes(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc
  ): Observable<Page<SiteType>> {
    return of(null);
  }
}
