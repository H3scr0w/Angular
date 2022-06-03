import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentWithoutSign',
})
export class PercentWithoutSignPipe implements PipeTransform {

  transform(value: number): any {
    const newValue = value * 100;
    let newStringValue = newValue.toFixed(2);
    newStringValue = newStringValue.split('.').join(',');
    return newStringValue;
  }

}
