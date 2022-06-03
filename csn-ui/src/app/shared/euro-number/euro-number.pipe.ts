import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'euroNumber',
})
export class EuroNumberPipe implements PipeTransform {

  transform(value: number): any {
    let newStringValue = '';
    if (value !== undefined && value !== null) {
      if (value === 0) {
        newStringValue = '0';
      } else {
        newStringValue = value.toFixed(2);
        newStringValue = newStringValue.split('.').join(',');
        newStringValue = newStringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      }
      newStringValue = newStringValue.concat(' €');
    }
    return newStringValue;
  }

}
