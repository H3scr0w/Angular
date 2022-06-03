import { HttpHeaders } from '@angular/common/http';
import { Sexe } from './enums';
import { FormControl } from '@angular/forms';

export class Constants {
  static patternDate = '(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\\d\\d';
  static patternNumber = '^[0-9]*$';
  static patternDecimalNumber = '^[0-9]+(.[0-9]{0,2})?$';
  static patternPercent = '^[0-9]+(.[0-9]{0,3})?$';
  static patternUppercaseString = '^[A-Z]+$';
  static sexe = Sexe;

  static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  static httpExportOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    responseType: 'blob' as 'json',
  };

  static maxBirthDateValidator() {
    return (control: FormControl) => {
      if (control.value) {
        const today = new Date();
        // convert to correct ISO 8601 format date
        const wrongFormat: string = control.value;
        const splittedFormat: string[] = wrongFormat.split('/');
        let isoFormat: string = '';

        if (splittedFormat && splittedFormat.length === 3) {
          const year = splittedFormat[2];
          const month = splittedFormat[1];
          const day = splittedFormat[0];
          isoFormat = year + '-' + month + '-' + day;
        }

        const valueDate = new Date(isoFormat);
        today.setHours(0, 0, 0, 0);
        valueDate.setHours(0, 0, 0, 0);
        if (valueDate.getTime() > today.getTime())
          return { 'maxBirthDate': true };
      }
      return null;
    };
  }
}
