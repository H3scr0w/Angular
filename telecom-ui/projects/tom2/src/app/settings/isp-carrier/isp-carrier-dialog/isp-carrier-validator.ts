import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IspCarrier } from '../../../shared/models/isp-carrier';
import { IspCarrierService } from '../../../shared/service/isp-carrier/isp-carrier.service';

export class IspCarrierValidator {
  static validateIspCarrierNotTaken(
    ispCarrierService: IspCarrierService,
    form: FormGroup,
    oldIsPCarrier: string
  ): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let ispCarriers: IspCarrier[] = [];
        const ispCarrier: IspCarrier = new IspCarrier();
        ispCarrier.ispCarrier = c.value;
        return ispCarrierService.getAllIspCarriers(0, 10, '', 'asc', ispCarrier.ispCarrier).pipe(
          map(res => {
            if (res.content) {
              ispCarriers = res.content;
              if (oldIsPCarrier) {
                ispCarriers = res.content.filter(isp => {
                  return isp.ispCarrier !== oldIsPCarrier;
                });
              }
              return ispCarriers.filter(isp => isp.ispCarrier.toLowerCase().trim() === c.value.toLowerCase().trim())
                .length === 0
                ? null
                : { isIspCarrierTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }
}
