import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {InfoBullesService} from '../../shared/services/info-bulles.service';
import {InfoBullesModule} from '../../shared/enums';

@Injectable()
export class RefinancementPretInfobullesResolve implements Resolve<any> {

  constructor(private infoBullesService: InfoBullesService) {}

  async resolve() {
    await this.infoBullesService.setData(InfoBullesModule.REFINANCEMENTPRET);
  }

}
