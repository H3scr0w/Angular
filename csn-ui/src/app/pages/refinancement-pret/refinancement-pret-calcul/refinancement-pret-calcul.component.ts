import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Ng7BootstrapBreadcrumbService} from 'ng7-bootstrap-breadcrumb';
import {TranslateService} from '@ngx-translate/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RefinancementPretService} from '../shared/refinancement-pret.service';
import {Constants} from '../../../shared/constants';
import {BaseModuleDirective} from '../../base-module.directive';
import {Subscription} from 'rxjs';
import {NotifySessionTimeoutServiceService} from '../../../shared/services/notify-session-timeout.service';
import {RadioInputModel} from '../../../shared/components/stepper/inputs/radio-input/radio-input-model';
import {DureeType, ModesRemboursement, NaturesCredit, TypesTableauAmortissement} from '../../../shared/enums';
import {SwitchToRefinancementService} from '../../../shared/services/switch-to-refinancement.service';
import {BsModalService} from 'ngx-bootstrap';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {MobileDetectorService} from '../../../shared/services/mobile-detector.service';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {RefinancementPretCalcul} from '../shared/refinancement-pret-calcul.model';

@Component({
  selector: 'ngx-app-refinancement-pret-calcul',
  templateUrl: './refinancement-pret-calcul.component.html',
  styleUrls: ['./refinancement-pret-calcul.component.scss'],
})
export class RefinancementPretCalculComponent extends BaseModuleDirective implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    localStorage.removeItem('rpForm');
  }

  refinancementPretFormGroup: FormGroup;

  natureCredit: FormControl;
  capitalEmprunte: FormControl;
  capitalRestantDu: FormControl;
  tauxDebiteurNominal: FormControl;
  dureePretInitial: FormControl;
  typeDureePretInitial: FormControl;
  tauxAnnuelAssurance: FormControl;
  fraisOctroiCredit: FormControl;
  dateFinancement: FormControl;
  typeTableauAmortissement: FormControl;
  datePremiereEcheance: FormControl;
  nombreEcheancesRachat: FormControl;
  modeRemboursement: FormControl;
  indemniteRemboursement: FormControl;
  fraisGarantie: FormControl;
  fraisAnnexes: FormControl;
  dureeSouhaitee: FormControl;
  typeDureeSouhaitee: FormControl;
  interets: FormControl;
  tauxAssuranceFrais: FormControl;
  cartouche: FormControl;
  texteLibre: FormControl;
  postToCalcul: boolean = false;
  naturesCredit = NaturesCredit;
  modesRemboursement = ModesRemboursement;
  typesTableauAmortissement = TypesTableauAmortissement;

  natureCreditRadioModel: RadioInputModel[] = [];
  modeRemboursementRadioModel: RadioInputModel[] = [];
  nombreEcheancesRadioModel: RadioInputModel[] = [];
  typeTableauAmortissementRadioModel: RadioInputModel[] = [];

  subscription: Subscription;

  constructor(private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
              private translateService: TranslateService, private refinancementPretService: RefinancementPretService,
              private notifySessionTimeOutService: NotifySessionTimeoutServiceService,
              public modalService: BsModalService, private infoBullesService: InfoBullesService,
              public mobileDetectorService: MobileDetectorService,
              private switchToRefinancementService: SwitchToRefinancementService,
              public notifySwitchCalcRestitService: NotifySwitchCalcRestitService) {
    super(modalService, mobileDetectorService, notifySwitchCalcRestitService);
    this.subscription = this.notifySessionTimeOutService.sessionTONotifiedSource$.subscribe(() => {
      this.saveFormData(this.refinancementPretFormGroup.getRawValue());
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowsResize(event?) {
    this.getScreenSize();
  }

  ngOnInit() {
    this.infoBulles = this.infoBullesService.getDataForRefinancementPret();
    this.getScreenSize();

    this.translateService.get('common.accueil').subscribe(res => {
      this.translateService.get('refinancement-pret.title').subscribe(res2 => {
        const breadcrumb = {accueil: res, refinancementPret: res2};
        this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
      });
    });
    this.createFormsControl();
    this.createFormGroup();
    this.fillModels();

    this.applySwitchIfOccurred();
    if (!this.postToCalcul) {
      this.restoreSavedData();
    }
    this.infoBulles = this.infoBullesService.getDataForRefinancementPret();
  }

  fillModels() {
    this.natureCreditRadioModel.push(
      new RadioInputModel('refinancement-pret.step1.immobilier', 'nature_credit'
        , this.naturesCredit.IMMOBILIER, 'ic_answer_estate'),
      new RadioInputModel('refinancement-pret.step1.consommation', 'nature_credit'
        , this.naturesCredit.CONSOMMATION, 'ic_answer_conso'),
      new RadioInputModel('refinancement-pret.step1.professionnel', 'nature_credit'
        , this.naturesCredit.PROFESSIONNEL, 'ic_answer_professional'));

    this.typeTableauAmortissementRadioModel.push(
      new RadioInputModel('pret.step2.type-tableau.avec-date', 'type_tableau_amortissement'
        , this.typesTableauAmortissement.AVEC_DATE, 'ic_answer_deadline'),
      new RadioInputModel('pret.step2.type-tableau.sans-date', 'type_tableau_amortissement'
        , this.typesTableauAmortissement.SANS_DATE, 'ic_answer_nodeadline'));

    this.nombreEcheancesRadioModel.push(
      new RadioInputModel('', 'nombre_echeances'
        , '1', 'ic_answer_qt1'),
      new RadioInputModel('', 'nombre_echeances'
        , '2', 'ic_answer_qt2'),
      new RadioInputModel('', 'nombre_echeances'
        , '4', 'ic_answer_qt4'),
      new RadioInputModel('', 'nombre_echeances'
        , '12', 'ic_answer_qt12'));

    this.modeRemboursementRadioModel.push(
      new RadioInputModel('refinancement-pret.step2.echeances-constantes', 'mode_remboursement'
        , this.modesRemboursement.CONSTANT, 'ic_answer_constant'),
      new RadioInputModel('refinancement-pret.step2.in-fine', 'mode_remboursement'
        , this.modesRemboursement.INFINE, 'ic_answer_infine'));
  }

  restoreSavedData() {
    const savedEntries = JSON.parse(localStorage.getItem('rpForm'));
    if (savedEntries != null) {
      this.sessionTimedOut = true;
      for (const [key, value] of Object.entries(savedEntries)) {
        this.refinancementPretFormGroup.get(key).setValue(value);
      }
    }
    localStorage.removeItem('rpForm');
  }

  saveFormData(val: any) {
    localStorage.setItem('rpForm', JSON.stringify(val));
  }

  createFormsControl() {
    this.dateFinancement = new FormControl({value: '', disabled: false},
      [Validators.required, Validators.pattern(Constants.patternDate)]);
    this.natureCredit = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.pattern(Constants.patternUppercaseString)]);
    this.capitalEmprunte = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternDecimalNumber)]);
    this.capitalRestantDu = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternDecimalNumber)]);
    this.tauxDebiteurNominal = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0.00), Validators.max(100.00),
        Validators.pattern(Constants.patternPercent)]);
    this.dureePretInitial = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.typeDureePretInitial = new FormControl({value: DureeType.ANNEE, disabled: true}, Validators.required);
    this.dureeSouhaitee = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.typeDureeSouhaitee = new FormControl({value: DureeType.ANNEE, disabled: true}, Validators.required);
    this.tauxAnnuelAssurance = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0.00), Validators.max(100.00),
        Validators.pattern(Constants.patternPercent)]);
    this.fraisOctroiCredit = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.fraisGarantie = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0), Validators.pattern(Constants.patternNumber)]);
    this.fraisAnnexes = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0), Validators.pattern(Constants.patternNumber)]);
    this.tauxAssuranceFrais = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0.00), Validators.max(100.00),
        Validators.pattern(Constants.patternPercent)]);
    this.indemniteRemboursement = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0.00), Validators.max(100.00),
        Validators.pattern(Constants.patternPercent)]);
    this.interets = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0.00), Validators.max(100.00),
        Validators.pattern(Constants.patternPercent)]);
    this.typeTableauAmortissement = new FormControl({value: '', disabled: true}, Validators.required);
    this.datePremiereEcheance = new FormControl({value: '', disabled: true},
      [Validators.pattern(Constants.patternDate)]);
    this.nombreEcheancesRachat = new FormControl({value: '', disabled: true}, Validators.required);
    this.modeRemboursement = new FormControl({value: '', disabled: true}, Validators.required);
    this.cartouche = new FormControl({value: '', disabled: true});
    this.texteLibre = new FormControl({value: '', disabled: true});
  }

  createFormGroup() {
    this.refinancementPretFormGroup = new FormGroup({
      nature_credit: this.natureCredit,
      capital_emprunte: this.capitalEmprunte,
      capital_restant_du: this.capitalRestantDu,
      duree: this.dureePretInitial,
      duree_type: this.typeDureePretInitial,
      taux_debiteur_nominal: this.tauxDebiteurNominal,
      taux_annuel_assurance: this.tauxAnnuelAssurance,
      frais_octroi_credit: this.fraisOctroiCredit,
      date_financement: this.dateFinancement,
      type_tableau_amortissement: this.typeTableauAmortissement,
      date_premiere_echeance: this.datePremiereEcheance,
      nombre_echeances: this.nombreEcheancesRachat,
      mode_remboursement: this.modeRemboursement,
      indemnites_remboursement: this.indemniteRemboursement,
      frais_garantie: this.fraisGarantie,
      frais_annexes: this.fraisAnnexes,
      duree_souhaitee: this.dureeSouhaitee,
      duree_souhaitee_type: this.typeDureeSouhaitee,
      interets: this.interets,
      nouveau_taux_assurance: this.tauxAssuranceFrais,
      cartouche: this.cartouche,
      texte_libre: this.texteLibre,
    });
  }

  onSubmit() {
    if (this.refinancementPretFormGroup.valid) {
      this.sessionTimedOut = false;
      // Pour le nouveau crédit, le nombre d'échéances par an est identique à celui du prêt initial et le mode de
      // remboursement est constant
      const model = new RefinancementPretCalcul(this.dateFinancement.value,
        this.natureCredit.value,
        Number.parseFloat(this.capitalEmprunte.value),
        this.getMontantTotalEmprunte(),
        Number.parseFloat(this.dureePretInitial.value),
        this.typeDureePretInitial.value,
        Number.parseFloat(this.tauxDebiteurNominal.value),
        Number.parseFloat(this.tauxAnnuelAssurance.value),
        Number.parseFloat(this.fraisOctroiCredit.value),
        this.getDatePremiereEcheance(),
        this.modeRemboursement.value,
        this.nombreEcheancesRachat.value,

        // New Credit Data
        Number.parseFloat(this.indemniteRemboursement.value),
        Number.parseFloat(this.interets.value),
        Number.parseFloat(this.dureeSouhaitee.value),
        this.typeDureeSouhaitee.value,
        Number.parseFloat(this.tauxAssuranceFrais.value),
        Number.parseFloat(this.fraisGarantie.value),
        Number.parseFloat(this.fraisAnnexes.value),
        this.getDatePremiereEcheance(),
        this.typeTableauAmortissement.value,
        this.cartouche.value,
        this.texteLibre.value);

      this.datePremiereEcheance.setValue(this.getDatePremiereEcheance());
      this.refinancementPretService.post(model);
      this.postToCalcul = true;
      this.showMobileForm = false;
    }
  }

  getDatePremiereEcheance(): Date {
    if (this.typeTableauAmortissement.value === this.typesTableauAmortissement.AVEC_DATE &&
      this.datePremiereEcheance.value != null && this.datePremiereEcheance.value !== '') {
      return this.datePremiereEcheance.value;
    }
    return null;
  }

  reset() {
    this.refinancementPretFormGroup.reset();
    this.postToCalcul = false;
    this.scrollTop();
  }

  parseFloatOr0(value: string): number {
    return value ? Number.parseFloat(value) : 0.0;
  }

  getRepriseCapital(): number {
    return this.parseFloatOr0(this.capitalRestantDu.value);
  }

  getMontantTotalEmprunte(): number {
    const repriseCapital = this.getRepriseCapital();
    return repriseCapital +
      (this.parseFloatOr0(this.indemniteRemboursement.value) * repriseCapital / 100) +
      this.parseFloatOr0(this.fraisGarantie.value) + this.parseFloatOr0(this.fraisAnnexes.value);
  }

  /**
   * Get data from switch service and setup component with its values.
   * Does nothing if there is no value
   */
  applySwitchIfOccurred(): void {
    const pretCalculData = this.switchToRefinancementService.getPretCalculData();
    if (pretCalculData) {
      this.natureCredit.setValue(pretCalculData.nature_credit);
      this.capitalEmprunte.setValue(pretCalculData.capital_emprunt);
      this.tauxDebiteurNominal.setValue(pretCalculData.taux_debiteur_nominal.toLocaleString());
      this.dureePretInitial.setValue(pretCalculData.duree);
      this.typeDureePretInitial.setValue(pretCalculData.duree_type);
      this.tauxAnnuelAssurance.setValue(pretCalculData.taux_annuel_assurance.toLocaleString());
      this.typeTableauAmortissement.setValue(pretCalculData.type_tableau_amortissement);
      if (pretCalculData.type_tableau_amortissement === TypesTableauAmortissement.AVEC_DATE) {
        this.datePremiereEcheance.setValue(pretCalculData.date_premiere_echeance);
      }
      this.fraisOctroiCredit.setValue(pretCalculData.frais_octroi_credit);
      this.dateFinancement.setValue(pretCalculData.date_financement);
      this.nombreEcheancesRachat.setValue('' + pretCalculData.nombre_echeances);
      this.modeRemboursement.setValue(pretCalculData.mode_remboursement);

      const capitalSelectedLine = this.switchToRefinancementService.getCapitalSelectedLine();
      const decimalSeparator = (0.1).toLocaleString()[1];
      this.capitalRestantDu.setValue(capitalSelectedLine.capitalRestant.toFixed(2)
        .replace('.', decimalSeparator));
      this.restitFromSwitch = true;

      this.datePremiereEcheance.setValue(this.getDatePremiereEcheance());
      this.indemniteRemboursement.enable();
      const model = new RefinancementPretCalcul(this.dateFinancement.value,
        this.natureCredit.value,
        pretCalculData.capital_emprunt,
        capitalSelectedLine.capitalRestant,
        pretCalculData.duree,
        this.typeDureePretInitial.value,
        pretCalculData.taux_debiteur_nominal,
        pretCalculData.taux_annuel_assurance,
        pretCalculData.frais_octroi_credit,
        this.getDatePremiereEcheance(),
        this.modeRemboursement.value,
        this.nombreEcheancesRachat.value,

        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        this.typeTableauAmortissement.value,
        null,
        null);

      this.datePremiereEcheance.setValue(this.getDatePremiereEcheance());
      this.refinancementPretService.post(model);
      this.postToCalcul = true;
      this.showMobileForm = false;
    }
  }
}
