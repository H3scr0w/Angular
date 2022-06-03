import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContractDTO } from '../../../shared/models/contracts';
import { ContractService } from '../../../shared/service/contract/contract.service';

export class ContractValidator {
  static validateContractCodeNotTaken(
    contractService: ContractService,
    form: FormGroup,
    oldCode: string
  ): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let contracts: ContractDTO[] = [];
        const contract: ContractDTO = new ContractDTO();
        contract.code = c.value;
        return contractService.getAllContract(0, 10, 'code', 'asc', contract.code).pipe(
          map(res => {
            if (res.content) {
              contracts = res.content;
              if (oldCode) {
                contracts = res.content.filter(con => {
                  return con.code !== oldCode;
                });
              }
              return contracts.filter(con => con.code.toLowerCase().trim() === c.value.toLowerCase().trim()).length ===
                0
                ? null
                : { contractCodeNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }
}
