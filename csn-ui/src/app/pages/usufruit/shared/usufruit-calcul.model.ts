import {Usufruitier} from './usufruitier.model';

export class UsufruitCalcul {
  public date_contrat: string;
  public type_demembrement: string;
  public valeur_bien: number;
  public valeur_locative_mensuelle_brute: number;
  public charges_usufructuaires_annuelles: number;
  public annee_duree_demembrement?: number;
  public mois_duree_demembrement?: number;
  public methode_evaluation_taux_rendement: string;
  public usufruitiers?: Array<Usufruitier>;
  public cartouche: string;
  public texte_libre: string;

  constructor(dateContrat: string, typeDemembrement: string, valeurBien: number, valeurLoc: number,
              charges: number, cartouche: string, texte_libre: string) {
    this.date_contrat = dateContrat;
    this.type_demembrement = typeDemembrement;
    this.valeur_bien = valeurBien;
    this.valeur_locative_mensuelle_brute = valeurLoc;
    this.charges_usufructuaires_annuelles = charges;
    this.cartouche = cartouche;
    this.texte_libre = texte_libre;
  }
}
