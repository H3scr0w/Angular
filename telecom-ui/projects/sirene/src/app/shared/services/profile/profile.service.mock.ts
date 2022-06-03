import { Page } from '@shared';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Profile } from '../../models/profile';
import { IProfileService } from './profile.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockProfileService implements IProfileService {
  getAllProfiles(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<Profile>> {
    return of(null);
  }
}
