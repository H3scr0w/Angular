import {Credirentier} from './credirentier.model';

export class RenteViagereCalcul {
  public date_contrat: string;
  public droit_usage_habitation: boolean;
  public valeur_bien: number;
  public bouquet_verse: number;
  public valeur_locative_mensuelle_brute: number;
  public charges_usufructuaires_annuelles: number;
  public credirentiers: Array<Credirentier>;
  public periodicite_versements: number;
  public terme_versements: string;
  public cartouche: string;
  public texte_libre: string;

  constructor(dateContrat: string, droitUsageHabitation: string, valeurBien: number, bouquetVerse: number,
              valeurLoc: number, charges: number, credirentiers: Array<Credirentier>,
              periodiciteVersements: number, termeVersements: string, cartouche: string, texte_libre: string) {
    this.date_contrat = dateContrat;
    this.droit_usage_habitation = (droitUsageHabitation === 'true');
    this.valeur_bien = valeurBien;
    this.bouquet_verse = bouquetVerse;
    this.valeur_locative_mensuelle_brute = valeurLoc;
    this.charges_usufructuaires_annuelles = charges;
    this.credirentiers = credirentiers;
    this.periodicite_versements = periodiciteVersements;
    this.terme_versements = termeVersements;
    this.cartouche = cartouche;
    this.texte_libre = texte_libre;
  }
}
