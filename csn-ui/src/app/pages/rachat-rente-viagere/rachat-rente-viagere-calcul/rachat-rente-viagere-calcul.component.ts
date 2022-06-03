import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RachatRenteViagereService} from '../shared/rachat-rente-viagere.service';
import {Constants} from '../../../shared/constants';
import {Ng7BootstrapBreadcrumbService} from 'ng7-bootstrap-breadcrumb';
import {TranslateService} from '@ngx-translate/core';
import {Sexe, TypesViager} from '../../../shared/enums';
import {RachatRenteViagereCalcul} from '../shared/rachat-rente-viagere-calcul.model';
import {BaseModuleDirective} from '../../base-module.directive';
import {Subscription} from 'rxjs';
import {NotifySessionTimeoutServiceService} from '../../../shared/services/notify-session-timeout.service';
import {formatDate} from '@angular/common';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {RadioInputModel} from '../../../shared/components/stepper/inputs/radio-input/radio-input-model';
import {BsModalService} from 'ngx-bootstrap';
import {MobileDetectorService} from '../../../shared/services/mobile-detector.service';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';

@Component({
  selector: 'ngx-app-rachat-rente-viagere-calcul',
  templateUrl: './rachat-rente-viagere-calcul.component.html',
  styleUrls: ['./rachat-rente-viagere-calcul.component.scss'],
})
export class RachatRenteViagereCalculComponent extends BaseModuleDirective implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    localStorage.removeItem('rrvForm');
  }

  vendueRadioModel: RadioInputModel[] = [];
  periodiciteRadioModel: RadioInputModel[] = [];

  rachatRenteFormGroup: FormGroup;
  credirentiersFormArray: FormArray;
  credirentiersToRestore: any = [];
  dateEvaluation: FormControl;
  dateContrat: FormControl;
  vendue: FormControl;
  valeurBien: FormControl;
  tauxRendementInitial: FormControl;
  montantInitialRente: FormControl;

  sexe = Sexe;
  typesViager = TypesViager;
  sexeCredirentier: FormControl;
  dateNaissanceCredirentier: FormControl;

  periodicite: FormControl;
  cartouche: FormControl;
  texteLibre: FormControl;

  tauxRevalRente: number = 0.;

  statusTauxRente: boolean = true;

  postToCalcul: boolean = false;
  subscription: Subscription;

  constructor(private _formBuilder: FormBuilder, private rachatRenteViagereService: RachatRenteViagereService,
              private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
              private translateService: TranslateService, private infoBullesService: InfoBullesService,
              private notifySessionTimeOutService: NotifySessionTimeoutServiceService,
              public modalService: BsModalService, public mobileDetectorService: MobileDetectorService,
              public notifySwitchCalcRestitService: NotifySwitchCalcRestitService) {
    super(modalService, mobileDetectorService, notifySwitchCalcRestitService);
    this.subscription = this.notifySessionTimeOutService.sessionTONotifiedSource$.subscribe(() => {
      this.saveFormData(this.rachatRenteFormGroup.getRawValue());
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowsResize(event?) {
    this.getScreenSize();
  }

  ngOnInit() {
    this.infoBulles = this.infoBullesService.getDataForRachatRenteViagere();
    this.getScreenSize();

    this.translateService.get('common.accueil').subscribe(res => {
      this.translateService.get('rachat-rente-viagere.title').subscribe(res2 => {
        const breadcrumb = {accueil: res, rachatRenteViagere: res2};
        this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
      });
    });
    this.createFormsControl();
    this.createFormGroup();
    this.fillModels();
    this.restoreSavedData();
    this.dateContrat.valueChanges.subscribe(() => this.getTauxRevalorisation());
  }

  restoreSavedData() {
    setTimeout(() => {
      const savedEntries = JSON.parse(localStorage.getItem('rrvForm'));
      if (savedEntries != null) {
        this.sessionTimedOut = true;
        for (const [key, value] of Object.entries(savedEntries)) {
          this.rachatRenteFormGroup.get(key).setValue(value);
          if (key === 'credirentiers') {
            this.credirentiersToRestore = value;
          } else {
            this.rachatRenteFormGroup.get(key).setValue(value);
          }
        }
      }
      localStorage.removeItem('rrvForm');
    });
  }

  fillModels() {
    this.vendueRadioModel.push(
      new RadioInputModel('rachat-rente-viagere.step2.occupe', 'type_viager'
        , this.typesViager.OCCUPE, 'ic_answer_occupied'),
      new RadioInputModel('rachat-rente-viagere.step2.libre', 'type_viager'
        , this.typesViager.LIBRE, 'ic_answer_available'));

    this.periodiciteRadioModel.push(
      new RadioInputModel('rachat-rente-viagere.step4.mensuel', 'periodicite_versements'
        , '12', 'ic_answer_daily'),
      new RadioInputModel('rachat-rente-viagere.step4.trimestriel', 'periodicite_versements'
        , '4', 'ic_answer_quarterly'),
      new RadioInputModel('rachat-rente-viagere.step4.semestriel', 'periodicite_versements'
        , '2', 'ic_answer_semester'),
      new RadioInputModel('rachat-rente-viagere.step4.annuel', 'periodicite_versements'
        , '1', 'ic_answer_annual'));
  }

  saveFormData(val: any) {
    localStorage.setItem('rrvForm', JSON.stringify(val));
  }

  createFormsControl() {
    this.dateEvaluation = new FormControl({value: '', disabled: false},
      [Validators.required, Validators.pattern(Constants.patternDate)]);
    this.dateContrat = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.pattern(Constants.patternDate)]);
    this.vendue = new FormControl({value: '', disabled: true}, Validators.required);
    this.valeurBien = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.tauxRendementInitial = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0.00), Validators.max(100.00),
        Validators.pattern(Constants.patternPercent)]);
    this.montantInitialRente = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.periodicite = new FormControl({value: '', disabled: true}, Validators.required);
    this.sexeCredirentier = new FormControl({value: '', disabled: false}, Validators.required);
    this.dateNaissanceCredirentier = new FormControl({value: '', disabled: false},
      [Validators.required, Constants.maxBirthDateValidator(),
        Validators.pattern(Constants.patternDate)]);
    this.credirentiersFormArray = this._formBuilder.array([]);
    this.cartouche = new FormControl({value: '', disabled: true});
    this.texteLibre = new FormControl({value: '', disabled: true});
  }

  createFormGroup() {
    this.rachatRenteFormGroup = new FormGroup({
      date_evaluation: this.dateEvaluation,
      date_contrat: this.dateContrat,
      droit_usage_habitation: this.vendue,
      valeur_bien: this.valeurBien,
      taux_rendement_initial: this.tauxRendementInitial,
      montant_initial_rente: this.montantInitialRente,
      credirentiers: this.credirentiersFormArray,
      periodicite_versements: this.periodicite,
      cartouche: this.cartouche,
      texte_libre: this.texteLibre,
    });
  }

  onSubmit() {
    if (this.rachatRenteFormGroup.valid) {
      this.sessionTimedOut = false;
      const model = new RachatRenteViagereCalcul(this.dateEvaluation.value,
        this.dateContrat.value, this.vendue.value,
        Number.parseFloat(this.valeurBien.value),
        Number.parseFloat(this.tauxRendementInitial.value),
        Number.parseFloat(this.montantInitialRente.value),
        this.credirentiersFormArray.value,
        Number.parseInt(this.periodicite.value, 0),
        this.cartouche.value,
        this.texteLibre.value);
      this.rachatRenteViagereService.post(model);
      this.postToCalcul = true;
      this.showMobileForm = false;
    }
  }

  reset() {
    super.reset();
    this.rachatRenteFormGroup.reset();
    this.postToCalcul = false;
  }

  getTauxRevalorisation() {
    if (this.dateContrat.valid) {
      this.rachatRenteViagereService.getTauxRevalorisationRente(
        formatDate(this.dateContrat.value, 'yyyy-MM-dd', 'fr-FR')).subscribe(resp => {
        this.tauxRevalRente = resp;
      }, (error) => {
      });
    }
  }
}
