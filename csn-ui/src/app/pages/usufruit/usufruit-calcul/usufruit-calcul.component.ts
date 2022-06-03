import {
  AfterContentChecked,
  AfterContentInit, AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UsufruitService} from '../shared/usufruit.service';
import {Constants} from '../../../shared/constants';
import {Ng7BootstrapBreadcrumbService} from 'ng7-bootstrap-breadcrumb';
import {TranslateService} from '@ngx-translate/core';
import {DeviceTypes, NumberFieldType, Sexe, TypesDemembrement} from '../../../shared/enums';
import {UsufruitCalcul} from '../shared/usufruit-calcul.model';
import {BaseModuleDirective} from '../../base-module.directive';
import {NotifySessionTimeoutServiceService} from '../../../shared/services/notify-session-timeout.service';
import {Subscription} from 'rxjs';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {UsufruitInputsModel} from '../shared/usufruit-inputs-model';
import {BsModalService} from 'ngx-bootstrap';
import {MobileDetectorService} from '../../../shared/services/mobile-detector.service';
import {RadioInputModel} from '../../../shared/components/stepper/inputs/radio-input/radio-input-model';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'ngx-app-usufruit-calcul',
  templateUrl: './usufruit-calcul.component.html',
  styleUrls: ['./usufruit-calcul.component.scss'],
})
export class UsufruitCalculComponent extends BaseModuleDirective implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    localStorage.removeItem('ufForm');
  }

  usufruitFormGroup: FormGroup;
  usufruitiersFormArray: FormArray;
  usufruitiersDataToRestore: any = [];

  dateContrat: FormControl;
  valeurBien: FormControl;
  valeurLocativeBrute: FormControl;
  chargesAnu: FormControl;
  typeDemembrement: FormControl;
  anneeDureeDemembrement: FormControl;
  moisDureeDemembrement: FormControl;
  cartouche: FormControl;
  texteLibre: FormControl;
  sexe = Sexe;
  typesDemembrement = TypesDemembrement;

  numberFieldTypes = NumberFieldType;
  private inputsModel: UsufruitInputsModel;
  radioInputsModelTypeDemembrement: RadioInputModel[];
  postToCalcul: boolean = false;

  subscription: Subscription;

  constructor(private _elementRef: ElementRef,
    private _formBuilder: FormBuilder,
    private usufruitService: UsufruitService,
    private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
    private translateService: TranslateService,
    private notifySessionTimeOutService: NotifySessionTimeoutServiceService,
    private infoBullesService: InfoBullesService, public modalService: BsModalService,
    public mobileDetectorService: MobileDetectorService,
    public notifySwitchCalcRestitService: NotifySwitchCalcRestitService,
    public datepipe: DatePipe,
  ) {
    super(modalService, mobileDetectorService, notifySwitchCalcRestitService);
  }

  @HostListener('window:resize', ['$event'])
  onWindowsResize(event?) {
    this.getScreenSize();
  }

  ngOnInit() {
    this.infoBulles = this.infoBullesService.getDataForUsufruit();
    this.getScreenSize();
    this.translateService.get('common.accueil').subscribe(res => {
      this.translateService.get('usufruit.title').subscribe(res2 => {
        const breadcrumb = { accueil: res, usufruit: res2 };
        this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
      });
    });
    this.fillInputsModels();
    this.createFormsControl();
    this.createFormGroup();

    // FIX #24770 fill value after delay so the ngx-form-error is triggered
    setTimeout(() => {
      this.dateContrat.setValue(this.getTodayDate());
    });
  }

  fillInputsModels() {
    this.inputsModel = new UsufruitInputsModel();
    this.inputsModel.isTabletOrMobile = (this.mobileDetectorService.deviceType === DeviceTypes.TABLET &&
      this.mobHeight > this.mobWidth) || this.mobileDetectorService.deviceType === DeviceTypes.MOBILE;
    this.radioInputsModelTypeDemembrement = this.inputsModel.radioInputsModelTypeDemembrement;
  }

  createFormsControl() {
    this.dateContrat = new FormControl({ value: '', disabled: false },
      [Validators.required, Validators.pattern(Constants.patternDate)]);
    this.valeurBien = new FormControl({ value: '', disabled: true },
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.valeurLocativeBrute = new FormControl({ value: '', disabled: true },
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.chargesAnu = new FormControl({ value: '', disabled: true },
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    this.typeDemembrement = new FormControl({ value: '', disabled: true }, Validators.required);
    this.anneeDureeDemembrement = new FormControl({ value: '', disabled: true },
      [Validators.required]);
    this.moisDureeDemembrement = new FormControl({ value: '', disabled: true },
      [Validators.required, Validators.max(11)]);
    this.usufruitiersFormArray = this._formBuilder.array([]);
    this.cartouche = new FormControl({ value: '', disabled: true });
    this.texteLibre = new FormControl({ value: '', disabled: true });
  }

  createFormGroup() {
    this.usufruitFormGroup = new FormGroup({
      date_contrat: this.dateContrat,
      type_demembrement: this.typeDemembrement,
      valeur_bien: this.valeurBien,
      valeur_locative_mensuelle_brute: this.valeurLocativeBrute,
      charges_usufructuaires_annuelles: this.chargesAnu,
      annee_duree_demembrement: this.anneeDureeDemembrement,
      mois_duree_demembrement: this.moisDureeDemembrement,
      persons: this.usufruitiersFormArray,
      cartouche: this.cartouche,
      texte_libre: this.texteLibre,
    });
  }

  onSubmit() {
    if (this.usufruitFormGroup.valid) {
      this.sessionTimedOut = false;
      const model = new UsufruitCalcul(this.dateContrat.value,
        this.typeDemembrement.value,
        Number.parseFloat(this.valeurBien.value),
        Number.parseFloat(this.valeurLocativeBrute.value),
        Number.parseFloat(this.chargesAnu.value),
        this.cartouche.value,
        this.texteLibre.value);
      model.annee_duree_demembrement = Number.parseFloat(this.anneeDureeDemembrement.value);
      model.mois_duree_demembrement = Number.parseFloat(this.moisDureeDemembrement.value);
      model.usufruitiers = this.usufruitiersFormArray.value;
      this.usufruitService.post(model);
      this.postToCalcul = true;
      this.showMobileForm = false;
    }
  }

  reset() {
    super.reset();
    this.usufruitFormGroup.reset();
    this.dateContrat.setValue(this.getTodayDate());
    this.postToCalcul = false;
    this.usufruitService.reset();
  }

  getTodayDate(): string {
    return this.datepipe.transform(new Date(), 'dd/MM/yyyy');
  }
}
