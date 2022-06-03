import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'annuite',
})
export class AnnuitePipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }
  transform(value: number): string {
    let res: string;
    if (value > 0) {
      switch (value) {
        case 1:
          res = this.translateService.instant('refinancement-pret.restitution.annuite');
          break;
        case 2:
          res = this.translateService.instant('refinancement-pret.restitution.semestrialite');
          break;
        case 4:
          res = this.translateService.instant('refinancement-pret.restitution.trimestrialite');
          break;
        case 12:
          res = this.translateService.instant('refinancement-pret.restitution.mensualite');
          break;
      }
    }
    return res;
  }

}
