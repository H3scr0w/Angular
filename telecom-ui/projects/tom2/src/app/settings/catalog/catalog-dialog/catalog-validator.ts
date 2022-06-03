import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Catalog } from '../../../shared/models/catalog';
import { CatalogService } from '../../../shared/service/catalog/catalog.service';

export class CatalogValidator {
  static validateCatalogNameNotTaken(
    catalogService: CatalogService,
    form: FormGroup,
    oldName: string
  ): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let catalogs: Catalog[] = [];
        const catalog: Catalog = new Catalog();
        catalog.name = c.value;
        return catalogService.getAllCatalogs(0, 10, '', 'asc', catalog.name).pipe(
          map(res => {
            if (res.content) {
              catalogs = res.content;
              if (oldName) {
                catalogs = res.content.filter(ct => {
                  return ct.name !== oldName;
                });
              }
              return catalogs.filter(ct => ct.name.toLowerCase().trim() === c.value.toLowerCase().trim()).length === 0
                ? null
                : { catalogNameNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }
}
