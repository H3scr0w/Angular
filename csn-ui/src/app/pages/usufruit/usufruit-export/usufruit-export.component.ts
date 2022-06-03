import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsufruitCalcul } from '../shared/usufruit-calcul.model';
import { UsufruitRestit } from '../shared/usufruit-restit.model';
import { NotifySwitchCalcRestitService } from 'src/app/shared/services/notity-switch-calc-restit.service';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Sexe, TypesDemembrement } from 'src/app/shared/enums';
import { RadioInputModel } from 'src/app/shared/components/stepper/inputs/radio-input/radio-input-model';
import { UsufruitInputsModel } from '../shared/usufruit-inputs-model';
import { BaseModuleDirective } from '../../base-module.directive';
import { InfoBullesService } from 'src/app/shared/services/info-bulles.service';
import { SingleDataSet, Label } from 'ng2-charts';
import { ChartType } from 'chart.js';
import * as Chart from 'chart.js';
import { CalculWithRestit } from '../shared/calcul-with-restit.model';

@Component({
  selector: 'ngx-app-usufruit-export',
  templateUrl: './usufruit-export.component.html',
  styleUrls: ['./usufruit-export.component.scss'],
})
export class UsufruitExportComponent extends BaseModuleDirective implements OnInit, OnDestroy {

  officeName: string;
  date: string;
  year: string;
  calculModel: UsufruitCalcul;

  resultModel: UsufruitRestit;

  usufruitFormGroup: FormGroup = new FormGroup({});
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

  radioInputsModelTypeDemembrement: RadioInputModel[];

  single: SingleDataSet = [];

  colorScheme: any[] = [{ backgroundColor: ['#005B93', '#39E5B1'] }];

  resultFormGroup: FormGroup = new FormGroup({});

  public labels: Label[] = ['Nue-propriété', 'Usufruit'];
  public chartType: ChartType = 'doughnut';

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

    this.fillInputsModels();
    this.createFormControls();
    this.createFormGroup();

    this.sub$.add(this.notifySwitchCalcRestitService.calculResultModel$.subscribe((res: CalculWithRestit) => {
      this.calculModel = res.calcul as UsufruitCalcul;
      this.resultModel = res.restit as UsufruitRestit;
      this.infoBulles = this.infoBullesService.getDataForUsufruit();
      // fill calcul part
      if (this.calculModel) {
        this.updateFormData();
      }

      // fill result part
      if (this.resultModel.nue_propriete_eco_pourcentage !== undefined
        && this.resultModel.usufruit_eco_pourcentage !== undefined) {
        const roundedNueProprietePourcent = Number(this.resultModel.nue_propriete_eco_pourcentage.toFixed(2));
        const roundedUsufruitPourcent = Number(this.resultModel.usufruit_eco_pourcentage.toFixed(2));
        this.single = [roundedNueProprietePourcent, roundedUsufruitPourcent];
      }

    }));

    // print
    this.sub$.add(this.notifySwitchCalcRestitService.print$.subscribe(() => window.print()));
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  private fillInputsModels() {
    this.inputsModel = new UsufruitInputsModel();
    this.radioInputsModelTypeDemembrement = this.inputsModel.radioInputsModelTypeDemembrement;
  }

  private createFormControls() {
    this.dateContrat = new FormControl({ value: '' });
    this.valeurBien = new FormControl({ value: '' });
    this.valeurLocativeBrute = new FormControl({ value: '' });
    this.chargesAnu = new FormControl({ value: '' });
    this.typeDemembrement = new FormControl({ value: '' });
    this.anneeDureeDemembrement = new FormControl({ value: '' });
    this.moisDureeDemembrement = new FormControl({ value: '' });
    this.usufruitiersFormArray = this._formBuilder.array([]);
    this.cartouche = new FormControl({ value: '' });
    this.texteLibre = new FormControl({ value: '' });
  }

  private createFormGroup() {
    this.usufruitFormGroup = new FormGroup({
      date_contrat: this.dateContrat,
      type_demembrement: this.typeDemembrement,
      valeur_bien: this.valeurBien,
      valeur_locative_mensuelle_brute: this.valeurLocativeBrute,
      charges_usufructuaires_annuelles: this.chargesAnu,
      annee_duree_demembrement: this.anneeDureeDemembrement,
      mois_duree_demembrement: this.moisDureeDemembrement,
      persons: this.usufruitiersFormArray,
    });

    this.resultFormGroup = new FormGroup({
      cartouche: this.cartouche,
      texte_libre: this.texteLibre,
    });
  }

  private updateFormData() {
    this.dateContrat.patchValue(this.calculModel.date_contrat);
    this.valeurBien.patchValue(this.calculModel.valeur_bien);
    this.valeurLocativeBrute.patchValue(
      this.calculModel.valeur_locative_mensuelle_brute,
    );
    this.chargesAnu.patchValue(this.calculModel.charges_usufructuaires_annuelles);
    this.typeDemembrement.patchValue(this.calculModel.type_demembrement);
    this.anneeDureeDemembrement.patchValue(this.calculModel.annee_duree_demembrement);
    this.moisDureeDemembrement.patchValue(this.calculModel.mois_duree_demembrement);
    this.usufruitiersDataToRestore = this.calculModel.usufruitiers;
    this.cartouche.patchValue(this.calculModel.cartouche);
    this.texteLibre.patchValue(this.calculModel.texte_libre);
  }

}
