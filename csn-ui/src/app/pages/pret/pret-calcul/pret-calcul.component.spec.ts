import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PretCalculComponent} from './pret-calcul.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {PretService} from '../shared/pret.service';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {PercentWithoutSignModule} from '../../../shared/percent-without-sign/percent-without-sign.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NotifySessionTimeoutServiceService} from '../../../shared/services/notify-session-timeout.service';
import {PopoverModule} from 'ngx-bootstrap';
import {InfobulleModule} from '../../infobulle.module';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ModalInfoBulleModule} from '../../../shared/components/modal-info-bulle/modal-info-bulle.module';
import {SwitchToRefinancementService} from '../../../shared/services/switch-to-refinancement.service';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {DureeType} from '../../../shared/enums';

describe('PretCalculComponent', () => {
  let component: PretCalculComponent;
  let fixture: ComponentFixture<PretCalculComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
      declarations: [ PretCalculComponent ],
      providers: [
        PretService,
        HttpClient,
        HttpHandler,
        NotifySessionTimeoutServiceService,
        DeviceDetectorService,
        SwitchToRefinancementService,
        NotifySwitchCalcRestitService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PretCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sbould call scroll method ', () => {
    const element = <HTMLDivElement>(document.createElement('div'));
    const spyScroll = spyOn(element, 'scrollIntoView');
    component.scroll(element);

    expect(spyScroll).toHaveBeenCalled();
  });

  it('should call onSubmit method', () => {
    const pretService = jasmine.createSpyObj('pretService', ['post']);

    component.natureCredit.enable();
    component.pretFormGroup.get('nature_credit').setValue('CONSOMMATION');
    expect(component.natureCredit.valid).toBeTruthy();

    component.dateFinancement.enable();
    component.pretFormGroup.get('date_financement').setValue('15/09/2019');
    expect(component.dateFinancement.valid).toBeTruthy();

    component.typeCalcul.enable();
    component.pretFormGroup.get('type_calcul').setValue('MENSUALITE');
    expect(component.typeCalcul.valid).toBeTruthy();

    component.capitalAEmprunter.enable();
    component.pretFormGroup.get('capital_emprunt').setValue('200000');
    expect(component.capitalAEmprunter.valid).toBeTruthy();

    component.tauxDebiteurNominal.enable();
    component.pretFormGroup.get('taux_debiteur_nominal').setValue('0.8');
    expect(component.tauxDebiteurNominal.valid).toBeTruthy();

    component.tauxAnnuelAssurance.enable();
    component.pretFormGroup.get('taux_annuel_assurance').setValue('0.3');
    expect(component.tauxAnnuelAssurance.valid).toBeTruthy();

    component.duree.enable();
    component.pretFormGroup.get('duree').setValue('15');
    expect(component.duree.valid).toBeTruthy();
    component.dureeType.enable();
    component.pretFormGroup.get('duree_type').setValue(DureeType.ANNEE);
    expect(component.dureeType.valid).toBeTruthy();

    component.fraisOctroiCredit.enable();
    component.pretFormGroup.get('frais_octroi_credit').setValue('1000');
    expect(component.fraisOctroiCredit.valid).toBeTruthy();

    component.datePremiereEcheance.enable();
    component.pretFormGroup.get('date_premiere_echeance').setValue('31/10/2019');
    expect(component.datePremiereEcheance.valid).toBeTruthy();

    component.nombreEcheances.enable();
    component.pretFormGroup.get('nombre_echeances').setValue('12');
    expect(component.nombreEcheances.valid).toBeTruthy();

    component.modeRemboursement.enable();
    component.pretFormGroup.get('mode_remboursement').setValue('CONSTANT');
    expect(component.modeRemboursement.valid).toBeTruthy();

    component.onSubmit();

    expect(component.postToCalcul).toBeTruthy();
  });

  it('should call reset method', () => {
    component.reset();
    const pretService = jasmine.createSpyObj('pretService', ['post']);
    expect(component.postToCalcul).toBeFalsy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
