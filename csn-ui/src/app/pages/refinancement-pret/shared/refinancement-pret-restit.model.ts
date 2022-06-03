import {RefinancementPretConditions} from './refinancement-pret-conditions.model';
import {DureeType, TypesTableauAmortissement} from '../../../shared/enums';

export class RefinancementPretRestit {
  capital_emprunt: number;
  duree_type: DureeType;
  conditionsPretInitial: RefinancementPretConditions;
  conditionsNouveauPret: RefinancementPretConditions;
  reprise_capital: number;
  indemnites_remboursement_anticipe: number;
  montant_rachat: number;
  tableau_amortissement: Array<any>;
  donnees_references_utilisees: string[];
  type_tableau_amortissement: TypesTableauAmortissement;
}
