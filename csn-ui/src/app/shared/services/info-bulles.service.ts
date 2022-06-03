import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InfoBulleModel} from '../models/info-bulle-model';
import {environment} from '../../../environments/environment';
import {InfoBullesModule} from '../enums';
import {InfoBulleDataModel} from '../models/info-bulle-data-model';

@Injectable({
  providedIn: 'root',
})
export class InfoBullesService {

  private infoBullesUsufruit: InfoBulleDataModel[];
  private infoBullesRenteViagere: InfoBulleDataModel[];
  private infoBullesRachatRenteVIagere: InfoBulleDataModel[];
  private infoBullesPret: InfoBulleDataModel[];
  private infoBullesRefinancementPret: InfoBulleDataModel[];
  constructor(private httpClient: HttpClient) {
  }

  getDataForUsufruit() {
    return this.infoBullesUsufruit;
  }

  getDataForRenteViagere() {
    return this.infoBullesRenteViagere;
  }

  getDataForRachatRenteViagere() {
    return this.infoBullesRachatRenteVIagere;
  }

  getDataForPret() {
    return this.infoBullesPret;
  }

  getDataForRefinancementPret() {
    return this.infoBullesRefinancementPret;
  }

  public async setData(module: InfoBullesModule) {
    return await this.httpClient.get<InfoBulleModel>(environment.apiUrl + '/' + module.toString()).toPromise()
      .then(res => {
      if (res != null && res.data != null && res.data.length > 0) {
        switch (module) {
          case InfoBullesModule.PRET:
            this.infoBullesPret = res.data;
            break;
          case InfoBullesModule.USUFRUIT:
            this.infoBullesUsufruit = res.data;
            break;
          case InfoBullesModule.REFINANCEMENTPRET:
            this.infoBullesRefinancementPret = res.data;
            break;
          case InfoBullesModule.RACHATRENTEVIAGERE:
            this.infoBullesRachatRenteVIagere = res.data;
            break;
          case InfoBullesModule.RENTEVIAGERE:
            this.infoBullesRenteViagere = res.data;
            break;
        }
      }
    });
  }
}
