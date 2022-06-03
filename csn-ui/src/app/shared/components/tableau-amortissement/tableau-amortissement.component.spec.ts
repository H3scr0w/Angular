import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauAmortissementComponent} from './tableau-amortissement.component';
import {ModalModule, PopoverModule} from 'ngx-bootstrap';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient} from '@angular/common/http';
import {EuroNumberModule} from '../../euro-number/euro-number.module';

describe('TableauAmortissementComponent', () => {
  let component: TableauAmortissementComponent;
  let fixture: ComponentFixture<TableauAmortissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableauAmortissementComponent],
      imports: [
        EuroNumberModule,
        TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableauAmortissementComponent);
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
