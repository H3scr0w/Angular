import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DureeType} from '../enums';
import {DecimalPipe} from '@angular/common';

@Pipe({
  name: 'duree',
})
export class DureePipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }
  transform(value: number, type: DureeType, isRefi: boolean): string {
    let res: string;
    if (value > 0) {
      if (type === DureeType.ANNEE) {
        const floored = Math.floor(value);
        if (!isRefi) {
          res = floored + ' ' + (value > 1 ? this.translateService.instant('common.annees') :
            this.translateService.instant('common.annee'));
          if (value - floored > 0) {
            res += ' ' + this.translateService.instant('common.et') + ' ' + Math.round((value - floored) * 12) + ' ' +
              this.translateService.instant('common.mois');
          }
        } else {
          if (value - floored > 0) {
            const pipe = new DecimalPipe('fr-FR');
            res = pipe.transform(value, '1.2-2');
          } else {
            res = floored + ' ' + this.translateService.instant('common.ans');
          }
        }
      } else {
        res = value + ' ' + this.translateService.instant('common.mois');
      }
    }
    return res;
  }

}
