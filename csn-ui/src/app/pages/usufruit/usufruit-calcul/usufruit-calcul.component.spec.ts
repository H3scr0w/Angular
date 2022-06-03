import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UsufruitCalculComponent} from './usufruit-calcul.component';
import {UsufruitService} from '../shared/usufruit.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NotifySessionTimeoutServiceService} from '../../../shared/services/notify-session-timeout.service';
import {PopoverModule} from 'ngx-bootstrap';
import {InfoBulleComponent} from '../../../shared/components/info-bulle/info-bulle.component';
import {RadioButtonInfoComponent} from '../../../shared/components/radio-button-info/radio-button-info.component';
import {EuroNumberModule} from '../../../shared/euro-number/euro-number.module';
import {FormErrorDisplayModule} from '../../../shared/form-error-display/form-error-display.module';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ModalInfoBulleModule} from '../../../shared/components/modal-info-bulle/modal-info-bulle.module';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import { DatePipe } from '@angular/common';

describe('UsufruitCalculComponent', () => {
  let component: UsufruitCalculComponent;
  let fixture: ComponentFixture<UsufruitCalculComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
        ReactiveFormsModule,
        PopoverModule.forRoot(),
        NgxMaskModule.forRoot(),
        EuroNumberModule,
        FormErrorDisplayModule,
        ModalInfoBulleModule,
      ],
      declarations: [UsufruitCalculComponent, InfoBulleComponent, RadioButtonInfoComponent],
      providers: [
        UsufruitService,
        InfoBullesService,
        HttpClient,
        HttpHandler,
        NotifySessionTimeoutServiceService,
        DeviceDetectorService,
        NotifySwitchCalcRestitService,
        DatePipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsufruitCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit method', () => {
    const usufruitService = jasmine.createSpyObj('usufruitService', ['post']);

    component.dateContrat.setValue('01/01/2019');
    expect(component.dateContrat.valid).toBeTruthy();

    component.valeurBien.enable();
    component.valeurBien.setValue('23');
    expect(component.valeurBien.valid).toBeTruthy();

    const typeDemembrement = new FormControl('TEMPORAIRE');
    component.typeDemembrement = typeDemembrement;
    expect(component.typeDemembrement.valid).toBeTruthy();

    const valeurLocativeBrute = new FormControl('45');
    component.valeurLocativeBrute = valeurLocativeBrute;
    expect(component.valeurLocativeBrute.valid).toBeTruthy();

    const chargesAnu = new FormControl('31');
    component.chargesAnu = chargesAnu;
    expect(component.chargesAnu.valid).toBeTruthy();

    const moisDureeDemembrement = new FormControl(1);
    component.moisDureeDemembrement = moisDureeDemembrement;
    expect(component.moisDureeDemembrement.valid).toBeTruthy();

    const anneeDureeDemembrement = new FormControl(2);
    component.anneeDureeDemembrement = anneeDureeDemembrement;
    expect(component.anneeDureeDemembrement.valid).toBeTruthy();

    const dateNaissanceUsufruitier = new FormControl('01/01/2019');
    const sexeFruitier = new FormControl(component.sexe.FEMME);
    component.usufruitiersFormArray.push(new FormGroup({
      sexe: sexeFruitier,
      date_naissance: dateNaissanceUsufruitier,
    }));
    expect(component.usufruitiersFormArray.valid).toBeTruthy();

    component.onSubmit();

    expect(component.postToCalcul).toBeTruthy();
  });

  it('should call reset method', () => {
    component.reset();
    const usufruitService = jasmine.createSpyObj('usufruitService', ['post']);
    expect(component.postToCalcul).toBeFalsy();
  });

  it('sbould call scroll method ', () => {
    const element = <HTMLDivElement>(document.createElement('div'));
    const spyScroll = spyOn(element, 'scrollIntoView');
    component.scroll(element);

    expect(spyScroll).toHaveBeenCalled();
  });

  it('sbould call showInfoValeurLocative method ', () => {

    const dateContrat = new FormControl('01/01/2019');

    component.dateContrat = dateContrat;
    expect(component.dateContrat.valid).toBeTruthy();
  });

  it('sbould call showInfoValeurLocativeBrute method ', () => {

    const valeurBien = new FormControl('123');

    component.valeurBien = valeurBien;
    expect(component.valeurBien.valid).toBeTruthy();
  });

  it('sbould call showInfoChargesAnu method ', () => {

    const valeurLocativeBrute = new FormControl('123');

    component.valeurLocativeBrute = valeurLocativeBrute;
    expect(component.valeurLocativeBrute.valid).toBeTruthy();
  });

  it('sbould call showInfoMethodeTauxRendement method ', () => {

    const charges = new FormControl('123');

    component.chargesAnu = charges;
    expect(component.chargesAnu.valid).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
