import {DureeType} from '../../../shared/enums';

export class NouveauCreditModel {
  nouv_duree_souhaitee: number;
  nouv_duree_souhaitee_type: DureeType;
  nouv_taux_debiteur_nominal: number;
  nouv_taux_annuel_assurance: number;
  frais_garantie: number;
  frais_annexes: number;
  nouv_date_premiere_echeance: Date;
  nouv_indemnites_remboursement: number;

  constructor(nouv_indemnites_remboursement: number,
              nouv_taux_debiteur_nominal: number, nouv_duree_souhaitee: number, nouv_duree_souhaitee_type: DureeType,
              nouv_taux_annuel_assurance: number, fraisGarantie: number, fraisAnnexes: number,
              nouv_date_premiere_echeance: Date) {
    this.setNewCreditData(nouv_indemnites_remboursement, nouv_taux_debiteur_nominal,
      nouv_duree_souhaitee, nouv_duree_souhaitee_type,
      nouv_taux_annuel_assurance, fraisGarantie, fraisAnnexes,
      nouv_date_premiere_echeance);
  }

  setNewCreditData(nouv_indemnites_remboursement: number, nouv_taux_debiteur_nominal: number,
                   nouv_duree_souhaitee: number, nouv_duree_souhaitee_type: DureeType,
                   nouv_taux_annuel_assurance: number, frais_garantie: number, frais_annexes: number,
                   nouv_date_premiere_echeance: Date) {
    // Excel "Calcul montant à refinancer" tab data
    this.nouv_indemnites_remboursement = nouv_indemnites_remboursement;
    this.nouv_taux_debiteur_nominal = nouv_taux_debiteur_nominal;
    this.nouv_duree_souhaitee = nouv_duree_souhaitee;
    this.nouv_duree_souhaitee_type = nouv_duree_souhaitee_type;
    this.nouv_taux_annuel_assurance = nouv_taux_annuel_assurance;
    this.frais_garantie = frais_garantie;
    this.frais_annexes = frais_annexes;
    this.nouv_date_premiere_echeance = nouv_date_premiere_echeance;
  }
}
