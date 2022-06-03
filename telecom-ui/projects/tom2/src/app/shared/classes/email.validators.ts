import { FormControl } from '@angular/forms';

export class EmailCustomValidators {
  static validateEmails(control: FormControl) {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let inValid = null;
    control.value?.forEach(item => {
      if (!EMAIL_REGEXP.test(item)) {
        inValid = { email: true };
      }
    });
    return inValid;
  }

  static validateRequired(control: FormControl) {
    if (control.value?.length === 0) {
      return { required: true };
    } else {
      return null;
    }
  }
}
