import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RefinancementPretCalculComponent} from './refinancement-pret-calcul.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {PercentWithoutSignModule} from '../../../shared/percent-without-sign/percent-without-sign.module';
import {RefinancementPretService} from '../shared/refinancement-pret.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NotifySessionTimeoutServiceService} from '../../../shared/services/notify-session-timeout.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ModalInfoBulleModule} from '../../../shared/components/modal-info-bulle/modal-info-bulle.module';
import {SwitchToRefinancementService} from '../../../shared/services/switch-to-refinancement.service';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';

describe('RefinancementPretCalculComponent', () => {
  let component: RefinancementPretCalculComponent;
  let fixture: ComponentFixture<RefinancementPretCalculComponent>;

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
        ModalInfoBulleModule,
      ],
      declarations: [ RefinancementPretCalculComponent ],
      providers: [
        RefinancementPretService,
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
    fixture = TestBed.createComponent(RefinancementPretCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
