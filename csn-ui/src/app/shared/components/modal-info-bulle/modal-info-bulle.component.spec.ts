import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoBulleComponent } from './modal-info-bulle.component';
import {BsModalRef, ModalModule} from 'ngx-bootstrap';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('ModalInfoBulleComponent', () => {
  let component: ModalInfoBulleComponent;
  let fixture: ComponentFixture<ModalInfoBulleComponent>;

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
      declarations: [ ModalInfoBulleComponent ],
      providers: [ BsModalRef,
        HttpClient,
        HttpHandler ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInfoBulleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
