import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PretRestitComponent} from './pret-restit.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {EuroNumberModule} from '../../../shared/euro-number/euro-number.module';
import {PretService} from '../shared/pret.service';
import {BsModalService, ModalModule} from 'ngx-bootstrap';
import {SwitchToRefinancementService} from '../../../shared/services/switch-to-refinancement.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {RouterTestingModule} from '@angular/router/testing';
import {DureePipeModule} from '../../../shared/duree-pipe/duree-pipe.module';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';

describe('PretRestitComponent', () => {
  let component: PretRestitComponent;
  let fixture: ComponentFixture<PretRestitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
        EuroNumberModule,
        ModalModule.forRoot(),
        DureePipeModule,
      ],
      declarations: [ PretRestitComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        PretService,
        BsModalService,
        SwitchToRefinancementService,
        DeviceDetectorService,
        NotifySwitchCalcRestitService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PretRestitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
