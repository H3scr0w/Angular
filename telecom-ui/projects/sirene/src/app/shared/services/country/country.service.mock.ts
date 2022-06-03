import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Country } from '../../models/country';
import { CountryHome } from '../../models/country-home';
import { Page } from '../../models/page.model';
import { ICountryService } from './country.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockCountryService implements ICountryService {
  getAllCountriesSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<CountryHome>> {
    return of(null);
  }

  getAllCountries(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: Sort.Asc | Sort.Desc | ''
  ): Observable<Page<Country>> {
    return of(null);
  }
}
