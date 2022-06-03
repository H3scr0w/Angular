import { UsufruitCalcul } from './usufruit-calcul.model';
import { UsufruitRestit } from './usufruit-restit.model';
import { RenteViagereCalcul } from '../../rente-viagere/shared/rente-viagere-calcul.model';
import { RachatRenteViagereCalcul } from '../../rachat-rente-viagere/shared/rachat-rente-viagere-calcul.model';
import { PretCalcul } from '../../pret/shared/pret-calcul.model';
import { RefinancementPretCalcul } from '../../refinancement-pret/shared/refinancement-pret-calcul.model';
import { RenteViagereRestit } from '../../rente-viagere/shared/rente-viagere-restit.model';
import { RachatRenteViagereRestit } from '../../rachat-rente-viagere/shared/rachat-rente-viagere-restit.model';
import { PretRestit } from '../../pret/shared/pret-restit.model';
import { RefinancementPretRestit } from '../../refinancement-pret/shared/refinancement-pret-restit.model';

export type CalculType = UsufruitCalcul |
  RenteViagereCalcul |
  RachatRenteViagereCalcul |
  PretCalcul |
  RefinancementPretCalcul;
export type RestitType = UsufruitRestit |
  RenteViagereRestit |
  RachatRenteViagereRestit |
  PretRestit |
  RefinancementPretRestit;

export class CalculWithRestit {

  public calcul: CalculType;
  public restit: RestitType;
  public officeName: string;

  constructor(calcul: CalculType, restit: RestitType) {
    this.calcul = calcul;
    this.restit = restit;
    const currentUser = (JSON.parse(localStorage.getItem('currentUser')));
    this.officeName = currentUser ? currentUser.officeName : '';
  }
}
