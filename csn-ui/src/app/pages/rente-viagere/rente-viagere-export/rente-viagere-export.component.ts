import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NotifySwitchCalcRestitService} from 'src/app/shared/services/notity-switch-calc-restit.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Sexe, TermesVersement, TypesViager} from 'src/app/shared/enums';
import {RadioInputModel} from 'src/app/shared/components/stepper/inputs/radio-input/radio-input-model';
import {UsufruitInputsModel} from '../../usufruit/shared/usufruit-inputs-model';
import {BaseModuleDirective} from '../../base-module.directive';
import {InfoBullesService} from 'src/app/shared/services/info-bulles.service';
import {CalculWithRestit} from '../../usufruit/shared/calcul-with-restit.model';
import {RenteViagereCalcul} from '../shared/rente-viagere-calcul.model';
import {RenteViagereRestit} from '../shared/rente-viagere-restit.model';

@Component({
  selector: 'ngx-app-rente-viagere-export',
  templateUrl: './rente-viagere-export.component.html',
  styleUrls: ['./rente-viagere-export.component.scss'],
})
export class RenteViagereExportComponent extends BaseModuleDirective implements OnInit, OnDestroy {

  resultFormGroup: FormGroup = new FormGroup({});

  officeName: string;
  date: string;
  year: string;
  calculModel: RenteViagereCalcul;

  resultModel: RenteViagereRestit;

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

  private inputsModel: UsufruitInputsModel;
  private sub$: Subscription = new Subscription();

  constructor(
    private _formBuilder: FormBuilder,
    private infoBullesService: InfoBullesService,
    public notifySwitchCalcRestitService: NotifySwitchCalcRestitService,
    public datepipe: DatePipe,
  ) {
    super(null, null, notifySwitchCalcRestitService);

    const currentUser = (JSON.parse(localStorage.getItem('currentUser')));
    this.officeName = currentUser ? currentUser.officeName : '';

    const today: Date = new Date();
    this.date = this.datepipe.transform(today, 'dd/MM/yyyy');
    this.year = this.datepipe.transform(today, 'yyyy');

    this.fillModels();
    this.createFormControls();
    this.createFormGroup();

    this.sub$.add(this.notifySwitchCalcRestitService.calculResultModel$.subscribe((res: CalculWithRestit) => {
      this.calculModel = res.calcul as RenteViagereCalcul;
      this.resultModel = res.restit as RenteViagereRestit;
      this.infoBulles = this.infoBullesService.getDataForRenteViagere();
      // fill calcul part
      if (this.calculModel) {
        this.updateFormData();
      }
    }));
    // print
    this.sub$.add(this.notifySwitchCalcRestitService.print$.subscribe(() => window.print()));
  }

  fillModels() {
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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  createFormControls() {
    this.dateContrat = new FormControl();
    this.droitUsageHabitation = new FormControl();
    this.valeurBien = new FormControl();
    this.bouquetVerse = new FormControl();
    this.valeurLocativeBrute = new FormControl();
    this.chargesAnu = new FormControl();
    this.periodicite = new FormControl();
    this.terme = new FormControl();
    this.sexeCredirentier = new FormControl();
    this.dateNaissanceCredirentier = new FormControl();
    this.credirentiersFormArray = this._formBuilder.array([]);
    this.cartouche = new FormControl();
    this.texteLibre = new FormControl();
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

    });
    this.resultFormGroup = new FormGroup({
      cartouche: this.cartouche,
      texte_libre: this.texteLibre,
    });
  }

  getPeriodicityIntlName(periodicity: number): string {
    switch (periodicity) {
      case 1:
        return 'rente-viagere.restitution.type-versements.annuelle';
      case 2:
        return 'rente-viagere.restitution.type-versements.semestrielle';
      case 4:
        return 'rente-viagere.restitution.type-versements.trimestrielle';
      case 12:
        return 'rente-viagere.restitution.type-versements.mensuelle';
    }
  }

  private updateFormData() {
    this.dateContrat.patchValue(this.calculModel.date_contrat);
    this.droitUsageHabitation.patchValue(this.calculModel.droit_usage_habitation ? 'true' : 'false');
    this.valeurBien.patchValue(this.calculModel.valeur_bien);
    this.bouquetVerse.patchValue(this.calculModel.bouquet_verse);
    this.valeurLocativeBrute.patchValue(this.calculModel.valeur_locative_mensuelle_brute);
    this.chargesAnu.patchValue(this.calculModel.charges_usufructuaires_annuelles);
    this.credirentiersToRestore = this.calculModel.credirentiers;
    this.periodicite.patchValue(this.calculModel.periodicite_versements.toString());
    this.terme.patchValue(this.calculModel.terme_versements);
    this.cartouche.patchValue(this.calculModel.cartouche);
    this.texteLibre.patchValue(this.calculModel.texte_libre);
  }
}
