import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneColumnLayoutComponent } from './one-column-layout.component';
import { HeaderComponent } from '../header/header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from '../../core/services/auth.service';
import {Ng7BootstrapBreadcrumbModule} from 'ng7-bootstrap-breadcrumb';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OneColumnLayoutComponent', () => {
  let component: OneColumnLayoutComponent;
  let fixture: ComponentFixture<OneColumnLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        Ng7BootstrapBreadcrumbModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [
        OneColumnLayoutComponent,
      ],
      providers: [
        AuthService, CookieService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneColumnLayoutComponent);
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
