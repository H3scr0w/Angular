import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RefinancementPretRestitComponent} from './refinancement-pret-restit.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {EuroNumberModule} from '../../../shared/euro-number/euro-number.module';
import {RefinancementPretService} from '../shared/refinancement-pret.service';
import {SwitchToRefinancementService} from '../../../shared/services/switch-to-refinancement.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {BsModalService, ModalModule} from 'ngx-bootstrap';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {DureePipeModule} from '../../../shared/duree-pipe/duree-pipe.module';
import {AnnuitePipeModule} from '../../../shared/annuite-pipe/annuite-pipe.module';

describe('RefinancementPretRestitComponent', () => {
  let component: RefinancementPretRestitComponent;
  let fixture: ComponentFixture<RefinancementPretRestitComponent>;

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
        EuroNumberModule,
        DureePipeModule,
        AnnuitePipeModule,
        ModalModule.forRoot(),
      ],
      declarations: [ RefinancementPretRestitComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        RefinancementPretService,
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
    fixture = TestBed.createComponent(RefinancementPretRestitComponent);
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
