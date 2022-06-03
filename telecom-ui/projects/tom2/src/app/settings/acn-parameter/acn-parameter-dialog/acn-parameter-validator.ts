import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AcnParameter } from '../../../shared/models/acn-parameter';
import { DeviceValuesList } from '../../../shared/models/device-values-list';
import { Networks } from '../../../shared/models/networks.model';
import { AcnParameterService } from '../../../shared/service/acn-parameter/acn-parameter.service';

export class AcnParameterValidator {
  static validateACNNumberNotTaken(acnParameterService: AcnParameterService, form: FormGroup): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        const acnParameter: AcnParameter = new AcnParameter();
        const network: Networks = form.get('network').value;
        const deviceValue: DeviceValuesList = form.get('acn').value;

        acnParameter.network = network !== null ? network.id : null;
        acnParameter.acn = deviceValue.value !== null ? deviceValue.value : null;
        return acnParameterService.getAcnParameterByNetworkAndAcn(acnParameter.network, acnParameter.acn).pipe(
          map(res => {
            if (res.acn) {
              return { isAcnTaken: true };
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
