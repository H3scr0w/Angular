import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Country, CountryFilter, CountryService } from '@shared';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CountryValidator {
  static validateCountryIdNotTaken(countryService: CountryService, id: string): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let country: Country[] = [];
        const countryFilter: CountryFilter = new CountryFilter();
        countryFilter.id = c.value.trim();
        return countryService.getAllCountries('', 0, 10, '', 'asc', countryFilter).pipe(
          map(res => {
            if (res.content) {
              country = res.content;
              if (id) {
                country = res.content.filter(con => {
                  return con.id !== id;
                });
              }
              return country.filter(con => con.id.toLowerCase().trim() === c.value.toLowerCase().trim()).length === 0
                ? null
                : { countryIdNotTaken: true };
            }
          })
        );
      }
      return null;
    };
  }

  static validateCountryNameNotTaken(countryService: CountryService, name: string): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        const countryFilter: CountryFilter = new CountryFilter();
        let country: Country[] = [];
        countryFilter.name = c.value.trim();
        return countryService.getAllCountries('', 0, 10, '', 'asc', countryFilter).pipe(
          map(res => {
            if (res.content) {
              country = res.content;
              if (name) {
                country = res.content.filter(con => {
                  return con.name !== name;
                });
              }
              return country.filter(con => con.name.toLowerCase().trim() === c.value.toLowerCase().trim()).length === 0
                ? null
                : { countryNameNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }
}
