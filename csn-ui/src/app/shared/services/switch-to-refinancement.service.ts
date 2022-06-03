import {Injectable} from '@angular/core';
import {PretRestit} from '../../pages/pret/shared/pret-restit.model';
import {PretCalcul} from '../../pages/pret/shared/pret-calcul.model';
import {SelectedPretLine} from './selected-pret-line.model';

/**
 * Service Handling switch form Pret Module to Refinancement Module
 */
@Injectable()
export class SwitchToRefinancementService {

  private pretCalculData: PretCalcul;
  private pretRestitData: PretRestit;
  private selectedPretLine: SelectedPretLine;

  private taux_annuel_assurance: number;

  setPretCalculData(calculData: PretCalcul): void {
    this.pretCalculData = calculData;
    this.taux_annuel_assurance = calculData.taux_annuel_assurance;
  }
  cleanPretCalculData() {
    this.pretCalculData = null;
    this.taux_annuel_assurance = null;
  }

  setPretRestitutionData(restitutionData: PretRestit): void {
    this.pretRestitData = restitutionData;
  }
  hasSwitched(): boolean {
    return  this.pretRestitData != null;
  }

  setPretSelectedLine(selectedPretLine: SelectedPretLine): void {
    this.selectedPretLine = selectedPretLine;
  }

  getPretCalculData(): PretCalcul {
    const res = this.pretCalculData;
    return res;
  }

  getCapitalSelectedLine(): SelectedPretLine {
    const res = this.selectedPretLine;
    return res;
  }

}
