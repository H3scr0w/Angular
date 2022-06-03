import { AbstractControl, ValidatorFn } from '@angular/forms';

export class RequestedValueValidators {
  static valueSelected(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value != null && c.value.id !== undefined) {
        return null;
      } else {
        return { match: true };
      }
    };
  }
}
