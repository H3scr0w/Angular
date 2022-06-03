import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RachatRenteViagereRestitComponent } from './rachat-rente-viagere-restit.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.module';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RachatRenteViagereService } from '../shared/rachat-rente-viagere.service';
import {EuroNumberModule} from '../../../shared/euro-number/euro-number.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {BsModalService, ModalModule} from 'ngx-bootstrap';
import {DeviceDetectorService} from 'ngx-device-detector';

describe('RachatRenteViagereRestitComponent', () => {
  let component: RachatRenteViagereRestitComponent;
  let fixture: ComponentFixture<RachatRenteViagereRestitComponent>;

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
        ModalModule.forRoot(),
      ],
      declarations: [RachatRenteViagereRestitComponent],
      providers: [
        HttpClient,
        HttpHandler,
        RachatRenteViagereService,
        NotifySwitchCalcRestitService,
        BsModalService,
        DeviceDetectorService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RachatRenteViagereRestitComponent);
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
