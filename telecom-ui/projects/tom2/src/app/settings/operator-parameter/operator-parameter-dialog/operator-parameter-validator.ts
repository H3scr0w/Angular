import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OperatorParameter } from '../../../shared/models/operator-parameter';
import { Operator } from '../../../shared/models/operators';
import { OperatorParameterService } from '../../../shared/service/operatorparameter/operator-parameter.service';

export class OperatorParameterValidator {
  static validateLabelNotTaken(operatorParameterService: OperatorParameterService, form: FormGroup): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c && c.value) {
        const operatorparameter: OperatorParameter = new OperatorParameter();
        const operator: Operator = form.get('operator').value;
        operatorparameter.label = c.value;
        operatorparameter.operator = operator !== null ? operator.id : null;
        operatorparameter.type = form.get('type').value;
        return operatorParameterService
          .getOperatorParameterByOperatorAndLabelAndType(
            operatorparameter.operator,
            operatorparameter.label,
            operatorparameter.type
          )
          .pipe(
            map(res => {
              if (res.label && c.value) {
                return res.label.toLocaleLowerCase().trim() === c.value.toLowerCase().trim()
                  ? { labelNotTaken: true }
                  : null;
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
