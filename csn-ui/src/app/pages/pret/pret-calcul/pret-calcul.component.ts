import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Ng7BootstrapBreadcrumbService} from 'ng7-bootstrap-breadcrumb';
import {TranslateService} from '@ngx-translate/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Constants} from '../../../shared/constants';
import {PretService} from '../shared/pret.service';
import {PretCalcul} from '../shared/pret-calcul.model';
import {
  DureeType,
  ModesCalculTaux,
  ModesRemboursement,
  NaturesCredit,
  TypesCalcul,
  TypesTableauAmortissement,
} from '../../../shared/enums';
import {BaseModuleDirective} from '../../base-module.directive';
import {Subscription} from 'rxjs';
import {NotifySessionTimeoutServiceService} from '../../../shared/services/notify-session-timeout.service';
import {RadioInputModel} from '../../../shared/components/stepper/inputs/radio-input/radio-input-model';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {MobileDetectorService} from '../../../shared/services/mobile-detector.service';
import {SwitchToRefinancementService} from '../../../shared/services/switch-to-refinancement.service';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
// tslint:disable-next-line:max-line-length
import {consistencyMatchValidator} from '../../../shared/validators/consistency.validator';
import {WarningMessageModalComponent} from '../../../shared/warning-message-modal/warning-message-modal.component';

@Component({
  selector: 'ngx-app-pret-calcul',
  templateUrl: './pret-calcul.component.html',
  styleUrls: ['./pret-calcul.component.scss'],
})
export class PretCalculComponent extends BaseModuleDirective implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    localStorage.removeItem('pForm');
    if (!this.switchToRefinancementService.hasSwitched()) {
      this.switchToRefinancementService.cleanPretCalculData();
    }
  }

  pretFormGroup: FormGroup;
  natureCredit: FormControl;
  capitalAEmprunter: FormControl;
  typeCalcul: FormControl;
  tauxDebiteurNominal: FormControl;
  mensualite: FormControl;
  duree: FormControl;
  dureeType: FormControl;
  tauxAnnuelAssurance: FormControl;
  fraisOctroiCredit: FormControl;
  dateFinancement: FormControl;
  datePremiereEcheance: FormControl;
  typeTableauAmortissement: FormControl;
  nombreEcheances: FormControl;
  modeRemboursement: FormControl;
  cartouche: FormControl;
  texteLibre: FormControl;
  postToCalcul: boolean = false;
  typesCalcul = TypesCalcul;
  naturesCredit = NaturesCredit;
  typesTableauAmortissement = TypesTableauAmortissement;
  modesCalculTaux = ModesCalculTaux;
  modesRemboursement = ModesRemboursement;

  natureCreditRadioModel: RadioInputModel[] = [];
  typeCalculRadioModel: RadioInputModel[] = [];
  modeRemboursementRadioModel: RadioInputModel[] = [];
  nombreEcheancesRadioModel: RadioInputModel[] = [];
  typeTableauAmortissementRadioModel: RadioInputModel[] = [];
  subscription: Subscription;
  bsModalRef: BsModalRef;

  constructor(private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
              private translateService: TranslateService, private pretService: PretService,
              private notifySessionTimeOutService: NotifySessionTimeoutServiceService,
              private infoBullesService: InfoBullesService, public modalService: BsModalService,
              public mobileDetectorService: MobileDetectorService,
              private switchToRefinancementService: SwitchToRefinancementService,
              public notifySwitchCalcRestitService: NotifySwitchCalcRestitService) {
    super(modalService, mobileDetectorService, notifySwitchCalcRestitService);
    this.subscription = this.notifySessionTimeOutService.sessionTONotifiedSource$.subscribe(() => {
      this.saveFormData(this.pretFormGroup.getRawValue());
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowsResize(event?) {
    this.getScreenSize();
  }

  ngOnInit() {
    this.infoBulles = this.infoBullesService.getDataForPret();
    this.getScreenSize();
    this.translateService.get('common.accueil').subscribe(res => {
      this.translateService.get('pret.title').subscribe(res2 => {
        const breadcrumb = {accueil: res, pret: res2};
        this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
      });
    });
    this.createFormsControl();
    this.createFormGroup();
    this.fillModels();
    this.restoreSavedData();
    this.infoBulles = this.infoBullesService.getDataForPret();
  }

  fillModels() {
    this.natureCreditRadioModel.push(
      new RadioInputModel('pret.step1.immobilier', 'nature_credit'
        , this.naturesCredit.IMMOBILIER, 'ic_answer_estate'),
      new RadioInputModel('pret.step1.consommation', 'nature_credit'
        , this.naturesCredit.CONSOMMATION, 'ic_answer_conso'),
      new RadioInputModel('pret.step1.professionnel', 'nature_credit'
        , this.naturesCredit.PROFESSIONNEL, 'ic_answer_professional'));

    this.typeCalculRadioModel.push(
      new RadioInputModel('pret.step1.types-calcul.mensualite', 'type_calcul'
        , this.typesCalcul.MENSUALITE, 'ic_answer_monthly_payment'),
      new RadioInputModel('pret.step1.types-calcul.duree', 'type_calcul'
        , this.typesCalcul.DUREE, 'ic_answer_duration'),
      new RadioInputModel('pret.step1.types-calcul.taux', 'type_calcul'
        , this.typesCalcul.TAUX, 'ic_answer_rate'));

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
      new RadioInputModel('pret.step2.echeances-constantes', 'mode_remboursement'
        , this.modesRemboursement.CONSTANT, 'ic_answer_constant'),
      new RadioInputModel('pret.step2.in-fine', 'mode_remboursement'
        , this.modesRemboursement.INFINE, 'ic_answer_infine'));
  }

  saveFormData(val: any) {
    localStorage.setItem('pForm', JSON.stringify(val));
  }

  restoreSavedData() {
    const savedEntries = JSON.parse(localStorage.getItem('pForm'));
    if (savedEntries != null) {
      this.sessionTimedOut = true;
      for (const [key, value] of Object.entries(savedEntries)) {
        this.pretFormGroup.get(key).setValue(value);
      }
    }
    localStorage.removeItem('pForm');
  }

  createFormsControl() {
    this.natureCredit = new FormControl({value: '', disabled: false},
      [Validators.required, Validators.pattern(Constants.patternUppercaseString)]);
    this.capitalAEmprunter = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.typeCalcul = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.pattern(Constants.patternUppercaseString)]);
    this.tauxDebiteurNominal = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0.00), Validators.max(100.00),
        Validators.pattern(Constants.patternPercent)]);
    this.mensualite = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.duree = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.dureeType = new FormControl({value: DureeType.ANNEE, disabled: true},
      [Validators.required, Validators.pattern(Constants.patternUppercaseString)]);
    this.tauxAnnuelAssurance = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0.00), Validators.max(100.00),
        Validators.pattern(Constants.patternPercent)]);
    this.fraisOctroiCredit = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.dateFinancement = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.pattern(Constants.patternDate)]);
    this.typeTableauAmortissement = new FormControl({value: '', disabled: true}, Validators.required);
    this.datePremiereEcheance = new FormControl({value: '', disabled: true},
      [Validators.pattern(Constants.patternDate)]);
    this.nombreEcheances = new FormControl({value: '', disabled: true}, Validators.required);
    this.modeRemboursement = new FormControl({value: '', disabled: true}, Validators.required);
    this.cartouche = new FormControl({value: '', disabled: true});
    this.texteLibre = new FormControl({value: '', disabled: true});
  }

  createFormGroup() {
    this.pretFormGroup = new FormGroup({
      nature_credit: this.natureCredit,
      capital_emprunt: this.capitalAEmprunter,
      type_calcul: this.typeCalcul,
      taux_debiteur_nominal: this.tauxDebiteurNominal,
      mensualite: this.mensualite,
      duree: this.duree,
      duree_type: this.dureeType,
      taux_annuel_assurance: this.tauxAnnuelAssurance,
      frais_octroi_credit: this.fraisOctroiCredit,
      date_financement: this.dateFinancement,
      type_tableau_amortissement: this.typeTableauAmortissement,
      date_premiere_echeance: this.datePremiereEcheance,
      nombre_echeances: this.nombreEcheances,
      mode_remboursement: this.modeRemboursement,
      cartouche: this.cartouche,
      texte_libre: this.texteLibre,
    });
    this.pretFormGroup.setValidators(consistencyMatchValidator);
    this.pretFormGroup.updateValueAndValidity();
    this.pretFormGroup.get('type_calcul').valueChanges.subscribe((val) => {
      const typeCalcul = this.pretFormGroup.get('type_calcul').value;
      if (typeCalcul !== '') {
        if (typeCalcul === TypesCalcul.DUREE ||
          typeCalcul === TypesCalcul.TAUX) {
          this.pretFormGroup.get('mode_remboursement').patchValue(ModesRemboursement.CONSTANT, {emitEvent: false});
        } else {
          this.pretFormGroup.get('mode_remboursement').patchValue('', {emitEvent: false});
        }
      }
    });
    this.pretFormGroup.valueChanges.subscribe((val) => {
      if (this.pretFormGroup.hasError('notMatching')) {
        if (this.bsModalRef == null) {
          const config = {
            backdrop: true,
            ignoreBackdropClick: true,
            keyboard: false,
            class: 'modal-dialog-centered',
            html: this.translateService.instant('pret.controle-coherence.message'),
          };
          const initialState = {
            html: this.translateService.instant('pret.controle-coherence.message'),
          };
          this.bsModalRef = this.modalService.show(WarningMessageModalComponent,
            Object.assign({}, config, {initialState}));
          this.bsModalRef.content.hideEmitter.subscribe(() => {
            this.bsModalRef = null;
          });
        }
      }
    });
  }

  onSubmit() {
    if (this.pretFormGroup.valid) {
      this.sessionTimedOut = false;
      const model = new PretCalcul(this.natureCredit.value,
        Number.parseFloat(this.capitalAEmprunter.value),
        this.typeCalcul.value,
        this.typeTableauAmortissement.value,
        Number.parseFloat(this.tauxDebiteurNominal.value),
        Number.parseFloat(this.duree.value),
        this.dureeType.value,
        Number.parseFloat(this.mensualite.value),
        Number.parseFloat(this.tauxAnnuelAssurance.value),
        Number.parseFloat(this.fraisOctroiCredit.value),
        this.dateFinancement.value,
        this.getDatePremiereEcheance(),
        Number.parseInt(this.nombreEcheances.value, 0),
        this.modeRemboursement.value,
        this.cartouche.value,
        this.texteLibre.value);
      this.pretService.post(model);
      this.postToCalcul = true;
      this.showMobileForm = false;
      // Save data to switch service in case it's used
      this.switchToRefinancementService.setPretCalculData(model);
    }
  }

  getDatePremiereEcheance(): string {
    if (this.typeTableauAmortissement.value === this.typesTableauAmortissement.AVEC_DATE
      && this.datePremiereEcheance.value !== '') {
      return this.datePremiereEcheance.value;
    }
    return null;
  }

  reset() {
    super.reset();
    this.pretFormGroup.reset();
    this.postToCalcul = false;
  }
}
