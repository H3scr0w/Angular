import {DureeType, ModesRemboursement, NaturesCredit, TypesTableauAmortissement} from '../../../shared/enums';
import {CreditInitialModel} from './credit-initial.model';
import {NouveauCreditModel} from './nouveau-credit.model';

export class RefinancementPretCalcul {
  type_tableau_amortissement: TypesTableauAmortissement;
  credit_initial: CreditInitialModel;
  nouveau_credit: NouveauCreditModel;
  cartouche: string;
  texte_libre: string;

  constructor(date_financement: Date, nature_credit: NaturesCredit, capital_emprunte: number,
              capital_restant_du: number, duree: number, duree_type: DureeType, taux_debiteur_nominal: number,
              taux_annuel_assurance: number, frais_octroi_credit: number, date_premiere_echeance: Date,
              mode_remboursement: ModesRemboursement, nombre_echeances: number, nouv_indemnites_remboursement: number,
              nouv_taux_debiteur_nominal: number, nouv_duree_souhaitee: number, nouv_duree_souhaitee_type: DureeType,
              nouv_taux_annuel_assurance: number, frais_garantie: number, frais_annexes: number,
              nouv_date_premiere_echeance: Date, type_tableau_amortissement: TypesTableauAmortissement,
              cartouche: string, texte_libre: string) {
    this.setOldCreditData(date_financement, nature_credit, capital_emprunte, capital_restant_du,
      duree, duree_type, taux_debiteur_nominal,
      taux_annuel_assurance, frais_octroi_credit, date_premiere_echeance, mode_remboursement, nombre_echeances);
    if (nouv_indemnites_remboursement && nouv_taux_debiteur_nominal && nouv_duree_souhaitee && nouv_duree_souhaitee_type
      && nouv_taux_annuel_assurance && frais_garantie) {
      this.setNewCreditData(nouv_indemnites_remboursement, nouv_taux_debiteur_nominal,
        nouv_duree_souhaitee, nouv_duree_souhaitee_type,
        nouv_taux_annuel_assurance, frais_garantie, frais_annexes,
        nouv_date_premiere_echeance);
    }
    this.type_tableau_amortissement = type_tableau_amortissement;
    this.cartouche = cartouche;
    this.texte_libre = texte_libre;
  }

  setOldCreditData(date_financement: Date, nature_credit: NaturesCredit, capital_emprunte: number,
                   capital_restant_du: number, duree: number, duree_type: DureeType, taux_debiteur_nominal: number,
                   taux_annuel_assurance: number, frais_octroi_credit: number, date_premiere_echeance: Date,
                   mode_remboursement: ModesRemboursement, nombre_echeances: number) {
    // Excel "Calcul reste à payer" tab data
    this.credit_initial = new CreditInitialModel(date_financement, nature_credit, capital_emprunte, capital_restant_du,
      duree, duree_type, taux_debiteur_nominal, taux_annuel_assurance, frais_octroi_credit, date_premiere_echeance,
      mode_remboursement, nombre_echeances);
  }

  setNewCreditData(nouv_indemnites_remboursement: number, nouv_taux_debiteur_nominal: number,
                   nouv_duree_souhaitee: number, nouv_duree_souhaitee_type: DureeType,
                   nouv_taux_annuel_assurance: number, frais_garantie: number, frais_annexes: number,
                   nouv_date_premiere_echeance: Date) {
    // Excel "Calcul montant à refinancer" tab data
    this.nouveau_credit = new NouveauCreditModel(nouv_indemnites_remboursement, nouv_taux_debiteur_nominal,
      nouv_duree_souhaitee, nouv_duree_souhaitee_type, nouv_taux_annuel_assurance, frais_garantie, frais_annexes,
      nouv_date_premiere_echeance);
  }
}
