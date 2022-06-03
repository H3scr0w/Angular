import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartsModule} from 'ng2-charts';
import {EuroNumberModule} from '../../../shared/euro-number/euro-number.module';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {InfobulleModule} from '../../infobulle.module';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import { UsufruitExportComponent } from './usufruit-export.component';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('UsufruitExportComponent', () => {
  let component: UsufruitExportComponent;
  let fixture: ComponentFixture<UsufruitExportComponent>;

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
        NgxChartsModule,
        ChartsModule,
        EuroNumberModule,
        InfobulleModule,
      ],
      declarations: [UsufruitExportComponent],
      providers: [
        HttpClient,
        HttpHandler,
        NotifySwitchCalcRestitService,
        DatePipe,
        InfoBullesService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsufruitExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
