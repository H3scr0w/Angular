import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UsufruitRestitComponent} from './usufruit-restit.component';
import {UsufruitService} from '../shared/usufruit.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {AuthService} from '../../../core/services/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {ChartsModule} from 'ng2-charts';
import {EuroNumberModule} from '../../../shared/euro-number/euro-number.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {InfobulleModule} from '../../infobulle.module';
import {BsModalService} from 'ngx-bootstrap';
import {DeviceDetectorService} from 'ngx-device-detector';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';

describe('UsufruitRestitComponent', () => {
  let component: UsufruitRestitComponent;
  let fixture: ComponentFixture<UsufruitRestitComponent>;

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
        NgxChartsModule,
        ChartsModule,
        EuroNumberModule,
        InfobulleModule,
      ],
      declarations: [ UsufruitRestitComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        UsufruitService,
        AuthService,
        CookieService,
        InfoBullesService,
        BsModalService,
        DeviceDetectorService,
        NotifySwitchCalcRestitService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsufruitRestitComponent);
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
