import {DureeType, TypesCalcul, TypesTableauAmortissement} from '../../../shared/enums';

export class PretCalcul {
  nature_credit: string;
  capital_emprunt: number;
  taux_debiteur_nominal: number;
  mensualite: number;
  duree: number;
  duree_type: DureeType;
  taux_annuel_assurance: number;
  frais_octroi_credit: number;
  date_financement: string;
  date_premiere_echeance: string;
  nombre_echeances: number;
  mode_remboursement: string;
  type_calcul: TypesCalcul;
  type_tableau_amortissement: TypesTableauAmortissement;
  cartouche: string;
  texte_libre: string;

  constructor(natureCredit: string, capitalEmprunt: number, typeCalcul: TypesCalcul,
              typesTableauAmortissement: TypesTableauAmortissement,
              taux_debiteur_nominal: number, duree: number, dureeType: DureeType, mensualite: number,
              tauxAnnuelAssurance: number, fraisOctroiCredit: number, dateFinancement: string,
              datePremiereEcheance: string, nombreEcheances: number, modeRemboursement: string, cartouche: string,
              texte_libre: string) {
    this.nature_credit = natureCredit;
    this.capital_emprunt = capitalEmprunt;
    this.taux_annuel_assurance = tauxAnnuelAssurance;
    this.frais_octroi_credit = fraisOctroiCredit;
    this.date_financement = dateFinancement;
    this.date_premiere_echeance = datePremiereEcheance;
    this.nombre_echeances = nombreEcheances;
    this.mode_remboursement = modeRemboursement;
    this.type_calcul = typeCalcul;
    this.taux_debiteur_nominal = taux_debiteur_nominal;
    this.duree = duree;
    this.duree_type = dureeType;
    this.mensualite = mensualite;
    this.type_tableau_amortissement = typesTableauAmortissement;
    this.cartouche = cartouche;
    this.texte_libre = texte_libre;
  }
}
