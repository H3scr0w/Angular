import {Credirentier} from './credirentier.model';

export class RachatRenteViagereCalcul {
  public date_evaluation: string;
  public date_contrat: string;
  public type_viager: string;
  public valeur_bien: number;
  public taux_rendement_initial: number;
  public montant_initial_rente: number;
  public credirentiers: Array<Credirentier>;
  public periodicite_versements: number;
  public cartouche: string;
  public texte_libre: string;

  constructor(dateEvaluation: string, dateContrat: string, typeViager: string, valeurBien: number,
              tauxRendementInitial: number, montantInitialRente: number, credirentiers: Array<Credirentier>,
              periodiciteVersements: number, cartouche: string, texte_libre: string) {
    this.date_evaluation = dateEvaluation;
    this.date_contrat = dateContrat;
    this.type_viager = typeViager;
    this.valeur_bien = valeurBien;
    this.taux_rendement_initial = tauxRendementInitial;
    this.montant_initial_rente = montantInitialRente;
    this.credirentiers = credirentiers;
    this.periodicite_versements = periodiciteVersements;
    this.cartouche = cartouche;
    this.texte_libre = texte_libre;
  }
}
