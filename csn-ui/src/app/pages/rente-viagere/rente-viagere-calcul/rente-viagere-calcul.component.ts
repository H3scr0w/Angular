import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RenteViagereService} from '../shared/rente-viagere.service';
import {Constants} from '../../../shared/constants';
import {TranslateService} from '@ngx-translate/core';
import {Ng7BootstrapBreadcrumbService} from 'ng7-bootstrap-breadcrumb';
import {
  DeviceTypes,
  Sexe,
  TermesVersement,
  TypesViager,
} from '../../../shared/enums';
import {RenteViagereCalcul} from '../shared/rente-viagere-calcul.model';
import {BaseModuleDirective} from '../../base-module.directive';
import {Subscription} from 'rxjs';
import {NotifySessionTimeoutServiceService} from '../../../shared/services/notify-session-timeout.service';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {RadioInputModel} from '../../../shared/components/stepper/inputs/radio-input/radio-input-model';
import {BsModalService} from 'ngx-bootstrap';
import {MobileDetectorService} from '../../../shared/services/mobile-detector.service';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'ngx-app-rente-viagere-calcul',
  templateUrl: './rente-viagere-calcul.component.html',
  styleUrls: ['./rente-viagere-calcul.component.scss'],
})
export class RenteViagereCalculComponent extends BaseModuleDirective implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    localStorage.removeItem('rvForm');
  }

  @Input() formScroll: HTMLElement;
  renteFormGroup: FormGroup;
  credirentiersFormArray: FormArray;
  credirentiersToRestore: any = [];

  dateContrat: FormControl;
  droitUsageHabitation: FormControl;
  valeurBien: FormControl;
  bouquetVerse: FormControl;
  valeurLocativeBrute: FormControl;
  chargesAnu: FormControl;

  sexe = Sexe;
  typesViager = TypesViager;
  termesVersement = TermesVersement;
  sexeCredirentier: FormControl;
  dateNaissanceCredirentier: FormControl;

  periodicite: FormControl;
  terme: FormControl;
  cartouche: FormControl;
  texteLibre: FormControl;

  vendueRadioModel: RadioInputModel[] = [];
  periodiciteRadioModel: RadioInputModel[] = [];
  termeRadioModel: RadioInputModel[] = [];


  subscription: Subscription;

  constructor(private _formBuilder: FormBuilder, private renteViagereService: RenteViagereService,
              private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
              private translateService: TranslateService, private infoBullesService: InfoBullesService,
              private notifySessionTimeOutService: NotifySessionTimeoutServiceService,
              public modalService: BsModalService, public mobileDetectorService: MobileDetectorService,
              public notifySwitchCalcRestitService: NotifySwitchCalcRestitService,
              public datepipe: DatePipe) {
    super(modalService, mobileDetectorService, notifySwitchCalcRestitService);
    this.subscription = this.notifySessionTimeOutService.sessionTONotifiedSource$.subscribe(() => {
      this.saveFormData(this.renteFormGroup.getRawValue());
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowsResize(event?) {
    this.getScreenSize();
  }

  ngOnInit() {
    this.infoBulles = this.infoBullesService.getDataForRenteViagere();
    this.getScreenSize();
    this.translateService.get('common.accueil').subscribe(res => {
      this.translateService.get('rente-viagere.title').subscribe(res2 => {
        const breadcrumb = {accueil: res, renteViagere: res2};
        this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
      });
    });
    this.createFormsControl();
    this.createFormGroup();
    this.fillModels();
    this.restoreSavedData();
  }

  restoreSavedData() {
    setTimeout(() => {
      const savedEntries = JSON.parse(localStorage.getItem('rvForm'));
      if (savedEntries != null) {
        this.sessionTimedOut = true;
        for (const [key, value] of Object.entries(savedEntries)) {
          if (key === 'credirentiers') {
            this.credirentiersToRestore = value;
          } else {
            this.renteFormGroup.get(key).setValue(value);
          }
        }
      }
      localStorage.removeItem('rvForm');
    });
  }

  fillModels() {
    const isTabletOrMobile = (this.mobileDetectorService.deviceType === DeviceTypes.TABLET &&
      this.mobHeight > this.mobWidth) || this.mobileDetectorService.deviceType === DeviceTypes.MOBILE;
    this.vendueRadioModel.push(
      new RadioInputModel('rente-viagere.step1.occupe', 'droit_usage_habitation'
        , 'true', 'ic_answer_yes'),
      new RadioInputModel('rente-viagere.step1.libre', 'droit_usage_habitation'
        , 'false', 'ic_answer_no'));

    this.periodiciteRadioModel.push(
      new RadioInputModel('rente-viagere.step3.mensuel', 'periodicite_versements'
        , '12', 'ic_answer_daily'),
      new RadioInputModel('rente-viagere.step3.trimestriel', 'periodicite_versements'
        , '4', 'ic_answer_quarterly'),
      new RadioInputModel('rente-viagere.step3.semestriel', 'periodicite_versements'
        , '2', 'ic_answer_semester'),
      new RadioInputModel('rente-viagere.step3.annuel', 'periodicite_versements'
        , '1', 'ic_answer_annual'));

    this.termeRadioModel.push(
      new RadioInputModel('rente-viagere.step3.avance', 'terme_versements'
        , this.termesVersement.AVANCE, 'ic_answer_advance'),
      new RadioInputModel('rente-viagere.step3.echu', 'terme_versements'
        , this.termesVersement.ECHU, 'ic_answer_duedate'));
  }

  saveFormData(val: any) {
    localStorage.setItem('rvForm', JSON.stringify(val));
  }

  maxBouquetValidator() {
    return (control: FormControl) => {
      if (control.value !== '' && this.valeurBien.value !== '' &&
        Number.parseFloat(control.value) > Number.parseFloat(this.valeurBien.value)) {
        return {'max-bouquet': true};
      }
      return null;
    };
  }

  createFormsControl() {
    this.dateContrat = new FormControl({value: this.getTodayDate(), disabled: false},
      [Validators.required, Validators.pattern(Constants.patternDate)]);
    this.droitUsageHabitation = new FormControl({value: '', disabled: false}, Validators.required);
    this.valeurBien = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.bouquetVerse = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(0), Validators.pattern(Constants.patternNumber),
        (control: FormControl) => this.maxBouquetValidator()(control)]);
    // Trigger validation on valeur bien update
    this.valeurBien.valueChanges.subscribe(() => {
      this.bouquetVerse.updateValueAndValidity();
    });
    this.valeurLocativeBrute = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.chargesAnu = new FormControl({value: '', disabled: true},
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.periodicite = new FormControl({value: '', disabled: true}, Validators.required);
    this.terme = new FormControl({value: '', disabled: true}, Validators.required);
    this.sexeCredirentier = new FormControl({value: '', disabled: false}, Validators.required);
    this.dateNaissanceCredirentier = new FormControl({value: '', disabled: false},
      [Validators.required, Constants.maxBirthDateValidator(),
        Validators.pattern(Constants.patternDate)]);
    this.credirentiersFormArray = this._formBuilder.array([]);
    this.cartouche = new FormControl({value: '', disabled: true});
    this.texteLibre = new FormControl({value: '', disabled: true});
  }

  createFormGroup() {
    this.renteFormGroup = new FormGroup({
      date_contrat: this.dateContrat,
      droit_usage_habitation: this.droitUsageHabitation,
      valeur_bien: this.valeurBien,
      bouquet_verse: this.bouquetVerse,
      valeur_locative_mensuelle_brute: this.valeurLocativeBrute,
      charges_usufructuaires_annuelles: this.chargesAnu,
      credirentiers: this.credirentiersFormArray,
      periodicite_versements: this.periodicite,
      terme_versements: this.terme,
      cartouche: this.cartouche,
      texte_libre: this.texteLibre,
    });
  }

  onSubmit() {
    if (this.renteFormGroup.valid) {
      this.sessionTimedOut = false;
      const model = new RenteViagereCalcul(
        this.dateContrat.value,
        this.droitUsageHabitation.value,
        this.valeurBien.value,
        Number.parseFloat(this.bouquetVerse.value),
        Number.parseFloat(this.valeurLocativeBrute.value),
        Number.parseFloat(this.chargesAnu.value),
        this.credirentiersFormArray.value,
        Number.parseInt(this.periodicite.value, 0),
        this.terme.value,
        this.cartouche.value,
        this.texteLibre.value);
      this.renteViagereService.post(model);
      this.postToCalcul = true;
      this.showMobileForm = false;
    }
  }

  reset() {
    super.reset();
    this.renteFormGroup.reset();
    this.dateContrat.setValue(this.getTodayDate());
    this.postToCalcul = false;
    this.renteViagereService.reset();
  }

  getTodayDate(): string {
    return this.datepipe.transform(new Date(), 'dd/MM/yyyy');
  }
}
