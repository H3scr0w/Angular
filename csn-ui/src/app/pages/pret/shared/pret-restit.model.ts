import {DureeType, TypesTableauAmortissement} from '../../../shared/enums';

export class PretRestit {
  montant_pret: number;
  duree_pret: number;
  duree_type: DureeType;
  taux_debiteur_nominal: number;
  montant_periode: number;
  montant_total: number;
  cout_total: number;
  interets: number;
  assurance: number;
  frais: number;
  taeg_teg: number;
  taux_usure: number;
  tableau_amortissement: Array<any>;
  type_tableau_amortissement: TypesTableauAmortissement;
  donnees_references_utilisees: string[];
}
