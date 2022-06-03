import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RenteViagereCalculComponent} from './rente-viagere-calcul.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {RenteViagereService} from '../shared/rente-viagere.service';
import {NgxMaskModule} from 'ngx-mask';
import {PercentWithoutSignModule} from '../../../shared/percent-without-sign/percent-without-sign.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NotifySessionTimeoutServiceService} from '../../../shared/services/notify-session-timeout.service';
import {PopoverModule} from 'ngx-bootstrap';
import {InfobulleModule} from '../../infobulle.module';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ModalInfoBulleModule} from '../../../shared/components/modal-info-bulle/modal-info-bulle.module';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {DatePipe} from '@angular/common';

describe('RenteViagereCalculComponent', () => {
  let component: RenteViagereCalculComponent;
  let fixture: ComponentFixture<RenteViagereCalculComponent>;

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
        NgxMaskModule.forRoot(),
        PercentWithoutSignModule,
        PopoverModule.forRoot(),
        InfobulleModule,
        ModalInfoBulleModule,
      ],
      declarations: [RenteViagereCalculComponent],
      providers: [
        RenteViagereService,
        HttpClient,
        HttpHandler,
        NotifySessionTimeoutServiceService,
        DeviceDetectorService,
        NotifySwitchCalcRestitService,
        DatePipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenteViagereCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sbould call scroll method ', () => {
    const element = <HTMLDivElement>(document.createElement('div'));
    const spyScrollRente = spyOn(element, 'scrollIntoView');
    component.scroll(element);

    expect(spyScrollRente).toHaveBeenCalled();
  });

  it('sbould call showInfoValeurLocative method ', () => {
    const vendue = new FormControl('01/01/2019');

    component.droitUsageHabitation = vendue;
    expect(component.droitUsageHabitation.valid).toBeTruthy();
  });

  it('sbould call showInfoChargesAnu method ', () => {
    const valeurLocativeBrute = new FormControl('123');

    component.valeurLocativeBrute = valeurLocativeBrute;
    expect(component.valeurLocativeBrute.valid).toBeTruthy();
  });

  it('sbould call showInfoValeurLocativeBrute method ', () => {
    const bouquetVerse = new FormControl('4056');

    component.bouquetVerse = bouquetVerse;
    expect(component.bouquetVerse.valid).toBeTruthy();
  });

  it('should call reset method', () => {
    component.reset();
    const renteViagereService = jasmine.createSpyObj('renteViagereService', ['post']);
    expect(component.postToCalcul).toBeFalsy();
  });

  it('sbould call showInfoBouquetVerse method ', () => {
    const valeurBien = new FormControl('3856');

    component.valeurBien = valeurBien;
    expect(component.valeurBien.valid).toBeTruthy();
  });

  it('should call onSubmit method', () => {
    const renteViagereService = jasmine.createSpyObj('renteViagereService', ['post']);

    component.dateContrat.setValue('01/01/2019');
    expect(component.dateContrat.valid).toBeTruthy();

    component.droitUsageHabitation.setValue('true');
    expect(component.droitUsageHabitation.valid).toBeTruthy();

    const valeurBien = new FormControl('23');
    component.valeurBien = valeurBien;
    expect(component.valeurBien.valid).toBeTruthy();

    const periodicite = new FormControl('4');
    component.periodicite = periodicite;
    expect(component.periodicite.valid).toBeTruthy();

    const bouquetVerse = new FormControl(2354);
    component.bouquetVerse = bouquetVerse;
    expect(component.bouquetVerse.valid).toBeTruthy();

    const valeurLocativeBrute = new FormControl('45');
    component.valeurLocativeBrute = valeurLocativeBrute;
    expect(component.valeurLocativeBrute.valid).toBeTruthy();

    const chargesAnu = new FormControl('31');
    component.chargesAnu = chargesAnu;
    expect(component.chargesAnu.valid).toBeTruthy();

    const terme = new FormControl(23);
    component.terme = terme;
    expect(component.terme.valid).toBeTruthy();

    const dateNaissanceCredirentier = new FormControl('01/01/2019');
    const sexeCredirentier = new FormControl(component.sexe.FEMME);
    component.credirentiersFormArray.push(new FormGroup({
      sexe: sexeCredirentier,
      date_naissance: dateNaissanceCredirentier,
    }));
    expect(component.credirentiersFormArray.valid).toBeTruthy();

    component.onSubmit();

    expect(component.postToCalcul).toBeTruthy();
  });

  it('sbould call showInfoTauxRente method ', () => {

    const terme = new FormControl('156');

    component.terme = terme;
    expect(component.terme.valid).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
