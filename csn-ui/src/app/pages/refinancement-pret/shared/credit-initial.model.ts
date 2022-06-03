import {DureeType, ModesRemboursement, NaturesCredit, TypesTableauAmortissement} from '../../../shared/enums';

export class CreditInitialModel {
  date_financement: Date;
  nature_credit: NaturesCredit;
  capital_emprunte: number;
  capital_restant_du: number;
  taux_debiteur_nominal: number;
  duree: number;
  duree_type: DureeType;
  taux_annuel_assurance: number;
  frais_octroi_credit: number;
  date_premiere_echeance: Date;
  nombre_echeances: number;
  mode_remboursement: string;

  constructor(date_financement: Date, nature_credit: NaturesCredit, capital_emprunte: number,
              capital_restant_du: number, duree: number, duree_type: DureeType, taux_debiteur_nominal: number,
              taux_annuel_assurance: number, frais_octroi_credit: number, date_premiere_echeance: Date,
              mode_remboursement: ModesRemboursement, nombre_echeances: number) {
    this.setOldCreditData(date_financement, nature_credit, capital_emprunte, capital_restant_du,
      duree, duree_type, taux_debiteur_nominal,
      taux_annuel_assurance, frais_octroi_credit, date_premiere_echeance, mode_remboursement, nombre_echeances);
  }

  setOldCreditData(date_financement: Date, nature_credit: NaturesCredit, capital_emprunte: number,
                   capital_restant_du: number, duree: number, duree_type: DureeType, taux_debiteur_nominal: number,
                   taux_annuel_assurance: number, frais_octroi_credit: number, date_premiere_echeance: Date,
                   mode_remboursement: ModesRemboursement, nombre_echeances: number) {
    // Excel "Calcul reste à payer" tab data
    this.date_financement = date_financement;
    this.nature_credit = nature_credit;
    this.capital_emprunte = capital_emprunte;
    this.capital_restant_du = capital_restant_du;
    this.duree = duree;
    this.duree_type = duree_type;
    this.capital_emprunte = capital_emprunte;
    this.taux_debiteur_nominal = taux_debiteur_nominal;
    this.taux_annuel_assurance = taux_annuel_assurance;
    this.frais_octroi_credit = frais_octroi_credit;
    this.date_premiere_echeance = date_premiere_echeance;
    this.mode_remboursement = mode_remboursement;
    this.nombre_echeances = nombre_echeances;
  }
}
