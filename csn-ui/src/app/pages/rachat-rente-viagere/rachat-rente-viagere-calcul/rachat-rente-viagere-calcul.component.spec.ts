import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RachatRenteViagereCalculComponent} from './rachat-rente-viagere-calcul.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {RachatRenteViagereService} from '../shared/rachat-rente-viagere.service';
import {NgxMaskModule} from 'ngx-mask';
import {PercentWithoutSignModule} from '../../../shared/percent-without-sign/percent-without-sign.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NotifySessionTimeoutServiceService} from '../../../shared/services/notify-session-timeout.service';
import {PopoverModule} from 'ngx-bootstrap';
import {InfobulleModule} from '../../infobulle.module';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ModalInfoBulleModule} from '../../../shared/components/modal-info-bulle/modal-info-bulle.module';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';

describe('RachatRenteViagereCalculComponent', () => {
  let component: RachatRenteViagereCalculComponent;
  let fixture: ComponentFixture<RachatRenteViagereCalculComponent>;

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
      declarations: [RachatRenteViagereCalculComponent],
      providers: [
        RachatRenteViagereService,
        HttpClient,
        HttpHandler,
        NotifySessionTimeoutServiceService,
        DeviceDetectorService,
        NotifySwitchCalcRestitService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RachatRenteViagereCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call reset method', () => {
    component.reset();
    const rachatRenteViagereService = jasmine.createSpyObj('rachatRenteViagereService', ['post']);
    expect(component.postToCalcul).toBeFalsy();
  });

  it('sbould call scroll method ', () => {
    const element = <HTMLDivElement>(document.createElement('div'));
    const spyScrollRachatRente = spyOn(element, 'scrollIntoView');
    component.scroll(element);

    expect(spyScrollRachatRente).toHaveBeenCalled();
  });

  it('sbould call showInfoValeurBien method ', () => {
    const valeurLocative = new FormControl('7345');

    component.vendue = valeurLocative;
    expect(component.vendue.valid).toBeTruthy();
  });

  it('should call onSubmit method', () => {
    const usufruitService = jasmine.createSpyObj('usufruitService', ['post']);

    component.dateEvaluation.setValue('01/01/2019');
    expect(component.dateEvaluation.valid).toBeTruthy();

    const dateContrat = new FormControl('01/01/2019');
    component.dateContrat = dateContrat;
    expect(component.dateContrat.valid).toBeTruthy();

    const valeurBien = new FormControl('23');
    component.valeurBien = valeurBien;
    expect(component.valeurBien.valid).toBeTruthy();

    const vendue = new FormControl('415');
    component.vendue = vendue;
    expect(component.vendue.valid).toBeTruthy();

    const tauxRendementInitial = new FormControl('1');
    component.tauxRendementInitial = tauxRendementInitial;
    expect(component.tauxRendementInitial.valid).toBeTruthy();

    const dateNaissanceCredirentier = new FormControl('01/01/2019');
    const sexeCredirentier = new FormControl(component.sexe.FEMME);
    component.credirentiersFormArray.push(new FormGroup({
      sexe: sexeCredirentier,
      date_naissance: dateNaissanceCredirentier,
    }));
    expect(component.credirentiersFormArray.valid).toBeTruthy();

    const montantInitialRente = new FormControl('4298');
    component.montantInitialRente = montantInitialRente;
    expect(component.montantInitialRente.valid).toBeTruthy();

    const periodicite = new FormControl('3');
    component.periodicite = periodicite;
    expect(component.periodicite.valid).toBeTruthy();

    component.onSubmit();

    expect(component.postToCalcul).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
