import { City, CityFilter, Page } from '@shared';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { ICityService } from './city.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockCityService implements ICityService {
  getAllCities(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: Sort.Asc | Sort.Desc | '',
    search?: string,
    cityFilter?: CityFilter
  ): Observable<Page<City>> {
    return of(null);
  }
  addCity(city: City): Observable<City> {
    throw new Error('Method not implemented.');
  }
  editCity(city: City): Observable<City> {
    throw new Error('Method not implemented.');
  }
  deleteCity(id: number): Observable<City> {
    throw new Error('Method not implemented.');
  }
  recoverCity(city: City): Observable<City> {
    throw new Error('Method not implemented.');
  }
}
