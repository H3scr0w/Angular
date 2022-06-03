import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RenteViagereRestitComponent} from './rente-viagere-restit.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {RenteViagereService} from '../shared/rente-viagere.service';
import {TabsetConfig, TabsModule} from 'ngx-bootstrap/tabs';
import {AuthService} from '../../../core/services/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {EuroNumberModule} from '../../../shared/euro-number/euro-number.module';
import {ChartsModule} from 'ng2-charts';
import {DeviceDetectorService} from 'ngx-device-detector';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {ModalModule} from 'ngx-bootstrap';

describe('RenteViagereRestitComponent', () => {
  let component: RenteViagereRestitComponent;
  let fixture: ComponentFixture<RenteViagereRestitComponent>;

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
        ChartsModule,
        TabsModule,
        EuroNumberModule,
        ModalModule.forRoot(),
      ],
      declarations: [ RenteViagereRestitComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        RenteViagereService,
        TabsetConfig,
        AuthService,
        CookieService,
        DeviceDetectorService,
        NotifySwitchCalcRestitService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenteViagereRestitComponent);
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
