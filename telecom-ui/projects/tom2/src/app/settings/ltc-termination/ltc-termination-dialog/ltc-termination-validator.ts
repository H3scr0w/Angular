import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Catalog } from '../../../shared/models/catalog';
import { LtcTermination } from '../../../shared/models/ltc-termination';
import { Operator } from '../../../shared/models/operators';
import { LtcTerminationService } from '../../../shared/service/ltc-termination/ltc-termination.service';

export class LtcTerminationValidator {
  static validateCatalogNameNotTaken(ltcTerminationService: LtcTerminationService, form: FormGroup): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        const ltcTermination: LtcTermination = new LtcTermination();
        const operator: Operator = form.get('operator').value;
        const catalog: Catalog = form.get('catalog').value;

        ltcTermination.operator = operator !== null ? operator.id : null;
        ltcTermination.catalogueId = catalog !== null ? catalog.id : null;

        return ltcTerminationService
          .getLtcTerminationByOperatorAndCatalog(ltcTermination.operator, ltcTermination.catalogueId)
          .pipe(
            map(res => {
              if (res.catalogueId && catalog) {
                return { isLtcCatalogTaken: true };
              }
            }),
            catchError(error => {
              return of(null);
            })
          );
      }
      return of(null);
    };
  }
}
