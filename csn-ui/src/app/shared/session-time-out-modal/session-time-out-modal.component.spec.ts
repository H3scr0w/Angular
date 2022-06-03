import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SessionTimeOutModalComponent} from './session-time-out-modal.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {AlertModule, BsModalRef, BsModalService, ModalModule} from 'ngx-bootstrap';
import {CookieService} from 'ngx-cookie-service';

describe('SessionTimeOutModalComponent', () => {
  let component: SessionTimeOutModalComponent;
  let fixture: ComponentFixture<SessionTimeOutModalComponent>;

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
        ModalModule.forRoot(),
        AlertModule.forRoot(),
      ],
      providers: [
        HttpClient,
        HttpHandler,
        BsModalRef,
        BsModalService,
        CookieService,
      ],
      declarations: [ SessionTimeOutModalComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTimeOutModalComponent);
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
