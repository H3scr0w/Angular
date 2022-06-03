import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WarningMessageModalComponent} from './warning-message-modal.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {BsModalRef, ModalModule} from 'ngx-bootstrap';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('MobileInfoModalComponent', () => {
  let component: WarningMessageModalComponent;
  let fixture: ComponentFixture<WarningMessageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),

      ],
      providers: [ BsModalRef,
        HttpClient,
        HttpHandler ],
      declarations: [WarningMessageModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningMessageModalComponent);
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
