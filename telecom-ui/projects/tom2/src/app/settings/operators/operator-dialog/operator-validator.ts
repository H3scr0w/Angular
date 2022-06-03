import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Operator } from '../../../shared/models/operators';
import { OperatorsService } from '../../../shared/service/operators/operators.service';

export class OperatorValidator {
  static validateOperatorNameNotTaken(
    operatorService: OperatorsService,
    form: FormGroup,
    oldName: string
  ): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let operators: Operator[] = [];
        const operator: Operator = new Operator();
        operator.name = c.value;
        return operatorService.getAllOperators(0, 10, '', 'asc', operator.name).pipe(
          map(res => {
            if (res.content) {
              operators = res.content;
              if (oldName) {
                operators = res.content.filter(op => {
                  return op.name !== oldName;
                });
              }
              return operators.filter(op => op.name.toLowerCase().trim() === c.value.toLowerCase().trim()).length === 0
                ? null
                : { operatorNameNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }
}
