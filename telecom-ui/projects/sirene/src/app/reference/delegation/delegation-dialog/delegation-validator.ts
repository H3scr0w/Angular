import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Delegation, DelegationFilter, DelegationService } from '@shared';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DelegationValidator {
  static validateDelegationIdNotTaken(delegationService: DelegationService, id: string): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let delegations: Delegation[] = [];
        const delegationFilter: DelegationFilter = new DelegationFilter();
        delegationFilter.id = c.value.trim();
        return delegationService.getAllDelegations('', delegationFilter).pipe(
          map(res => {
            if (res.content) {
              delegations = res.content;
              if (id) {
                delegations = res.content.filter(delegation => {
                  return delegation.id !== id;
                });
              }
              return delegations.filter(
                delegation => delegation.id.toLowerCase().trim() === c.value.toLowerCase().trim()
              ).length === 0
                ? null
                : { delegationIdNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }

  static validateDelegationNameNotTaken(delegationService: DelegationService, name: string): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let delegations: Delegation[] = [];
        const delegationFilter: DelegationFilter = new DelegationFilter();
        delegationFilter.name = c.value.trim();
        return delegationService.getAllDelegations('', delegationFilter).pipe(
          map(res => {
            if (res.content) {
              delegations = res.content;
              if (name) {
                delegations = res.content.filter(delegation => {
                  return delegation.name !== name;
                });
              }
              return delegations.filter(
                delegation => delegation.name.toLowerCase().trim() === c.value.toLowerCase().trim()
              ).length === 0
                ? null
                : { delegationNameNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }
}
