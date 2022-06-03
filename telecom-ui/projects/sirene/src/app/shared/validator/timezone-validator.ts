import { AbstractControl, ValidatorFn } from '@angular/forms';
import { TimeZone } from '@shared';

export class TimezoneValidators {
  static valueSelected(timeZoneList: TimeZone[]): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value != null) {
        const selectboxValue = c.value;
        const pickedOrNot = timeZoneList.filter(timezone => timezone.id === selectboxValue);
        if (pickedOrNot.length > 0) {
          return null;
        } else {
          return { match: true };
        }
      }
    };
  }
}
