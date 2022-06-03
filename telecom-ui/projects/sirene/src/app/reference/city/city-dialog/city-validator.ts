import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { City, CityFilter, CityService } from '@shared';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CityValidator {
  static validateCityNameNotTaken(cityService: CityService, form: FormGroup, oldName: string): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let cities: City[] = [];
        const cityFilter: CityFilter = new CityFilter();
        cityFilter.name = c.value;
        return cityService.getAllCities(0, 10, '', 'asc', '', cityFilter).pipe(
          map(res => {
            if (res.content) {
              cities = res.content;
              if (oldName) {
                cities = res.content.filter(city => {
                  return city.name !== oldName;
                });
              }
              if (form.value.country === null) {
                return { countryEmpty: true };
              }
              return cities.filter(
                city =>
                  city.name.toLowerCase().trim() === c.value.toLowerCase().trim() &&
                  city.country.id === form.value.country.id
              ).length === 0
                ? null
                : { cityNameNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }
}
