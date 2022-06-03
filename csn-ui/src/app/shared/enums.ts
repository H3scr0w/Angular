export enum ApiNotarialeGender {
  MAN = 'masculin',
  WOMAN = 'feminin',
}

export enum Sexe {
  HOMME = 'HOMME',
  FEMME = 'FEMME',
}

export enum TypesDemembrement {
  VIAGER = 'VIAGER',
  TEMPORAIRE = 'TEMPORAIRE',
}

export enum NatureBail {
  CIVIL = 'CIVIL',
  COMMERCIAL = 'COMMERCIAL',
}

export enum MethodesEvaluationTauxRendement {
  ACHEVEMENT = 'ACHEVEMENT',
  JOUR = 'JOUR',
}

export enum TypesViager {
  OCCUPE = 'OCCUPE',
  LIBRE = 'LIBRE',
}

export enum TermesVersement {
  ECHU = 'ECHU',
  AVANCE = 'AVANCE',
}

export enum NaturesCredit {
  IMMOBILIER = 'IMMOBILIER',
  CONSOMMATION = 'CONSOMMATION',
  PROFESSIONNEL = 'PROFESSIONNEL',
}

export enum TypesCalcul {
  MENSUALITE = 'MENSUALITE',
  TAUX = 'TAUX',
  DUREE = 'DUREE',
}

export enum ModesCalculTaux {
  ACTUARIEL = 'ACTUARIEL',
  PROPORTIONNEL = 'PROPORTIONNEL',
}

export enum TypesTableauAmortissement {
  AVEC_DATE = 'AVEC_DATE',
  SANS_DATE = 'SANS_DATE',
}

export enum ModesRemboursement {
  CONSTANT = 'CONSTANT',
  INFINE = 'INFINE',
  REPAYMENTDOWN = 'REPAYMENTDOWN',
  REPAYMENTUP = 'REPAYMENTUP',
}

export enum NumberFieldType {
  EURO,
  PERCENT,
  YEAR,
}

export enum InfoBullesModule {
  USUFRUIT = 'usufruit/info-bulle',
  RENTEVIAGERE = 'rente/info-bulle',
  RACHATRENTEVIAGERE = 'rachat-rente/info-bulle',
  PRET = 'pret/info-bulle',
  REFINANCEMENTPRET = 'refinancement-pret/info-bulle',
}

export enum InfoBulleCodes {
  DATE_CONTRAT = 'date_contrat',
  DROIT_USAGE_HABITATION = 'droit_usage_habitation',
  VALEUR_LOCATIVE = 'valeur_locative',
  VALEUR_DU_BIEN = 'valeur_bien',
  VALEUR_LOC_MENS_BRUTE = 'valeur_loc_mens_brute',
  CHARGES_ANNUELLES_BIEN = 'charges_annuelles_bien',
  EVALUATION_METHODE_TAUX_RENDEMENT = 'evaluation_methode_taux_rendement',
  TYPE_DEMEMBREMENT = 'type_demembrement',
  USUFRUITIERS = 'usufruitiers',
  CREDIRENTIERS = 'credirentiers',
  PERIODICITE_VERSEMENTS = 'periodicite_versements',
  TERMES_VERSEMENTS = 'termes_versements',
  ACHEVEMENT_DEMEMBREMENT = 'achevement_demembrement',
  JOUR_DEMEMBREMENT = 'jour_demembrement',
  TAUX_RENDEMENT = 'taux_rendement',
  VALEUR_PLEINE_PROPRIETE = 'valeur_pleine_propriete',
  MONTANT_BOUQUET_VERSE = 'montant_bouquet_verse',
  METHODE_EVAL_ACHEVEMENT = 'methode_eval_achevement',
  METHODE_EVAL_JOUR = 'methode_eval_jour',
  TAUX_REVALORISATION_RENTE = 'taux_revalorisation_rente',
  TAUX_RENDEMENT_CALCULE = 'taux_rendement_calcule',
  VALEUR_INITIALE_PLEINE_PROPRIETE = 'valeur_initiale_pleine_propriete',
  DUREE_DEMEMBREMENT = 'duree_demembrement',
  DATE_EVALUATION = 'date_evaluation',
  DATE_CONTRAT_INITIAL = 'date_contrat_initial',
  TAUX_RENDEMENT_ANNUEL_INITIAL = 'taux_rendement_annuel_initial',
  MONTANT_INITIAL_RENTE = 'montant_initial_rente',
  NATURE_CREDIT = 'nature_credit',
  CAPITAL_EMPRUNT = 'capital_emprunt',
  CAPITAL_RESTANT_DU = 'capital_restant_du',
  TYPE_CALCUL = 'type_calcul',
  DUREE_PRET = 'duree_pret',
  TAUX_PRET = 'taux_pret',
  MENSUALITE = 'mensualite',
  TAUX_ANNUEL_ASSURANCE = 'taux_annuel_assurance',
  FRAIS_OCTROI_CREDIT = 'frais_octroi_credit',
  DATE_PREMIERE_ECHEANCE = 'date_premiere_echeance',
  DATE_FINANCEMENT = 'date_financement',
  MODE_CALCUL_TAUX = 'mode_calcul_taux',
  NOMBRE_ECHEANCE = 'nombre_echeance',
  MODE_REMBOURSEMENT = 'mode_remboursement',
  REPRISE_CAPITAL = 'reprise_capital',
  INDEMNITE_REMBOURSEMENT = 'indemnite_remboursement',
  FRAIS_GARANTIE = 'frais_garantie',
  FRAIS_ANNEXES = 'frais_annexes',
  MONTANT_EMPRUNT = 'montant_emprunt',
  DUREE_SOUHAITEE = 'duree_souhaitee',
  INTERETS = 'interets',
  TAUX_ASSURANCE_FRAIS = 'taux_assurance_frais',
  TAEG = 'taeg',
  TAUX_USURE_REFERENCE = 'taux_usure_reference',
  TYPE_TABLEAU = 'type_tableau',
  DONNEES_IMPORTEES = 'donnees_importees',
  REFINANCEMENT_CALCULE = 'refinancement_calcule',
  CARTOUCHE = 'cartouche',
  TEXTE_LIBRE = 'texte_libre',
  USUFRUIT_ETAPE_1 = 'usufruit_etape_1',
  USUFRUIT_ETAPE_2 = 'usufruit_etape_2',
  USUFRUIT_ETAPE_3 = 'usufruit_etape_3',
  RENTE_VIAGERE_ETAPE_1 = 'rente_viagere_etape_1',
  RENTE_VIAGERE_ETAPE_2 = 'rente_viagere_etape_2',
  RENTE_VIAGERE_ETAPE_3 = 'rente_viagere_etape_3',
  PRET_ETAPE_1 = 'pret_etape_1',
  PRET_ETAPE_2 = 'pret_etape_2',
}

export enum DeviceTypes {
  DESKTOP,
  TABLET,
  MOBILE,
}

export enum DureeType {
  MOIS = 'MOIS',
  ANNEE = 'ANNEE',
}
