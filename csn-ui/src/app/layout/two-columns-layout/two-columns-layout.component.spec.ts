import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoColumnsLayoutComponent } from './two-columns-layout.component';
import { HeaderComponent } from '../header/header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from '../footer/footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '../../app.module';
import {AuthService} from '../../core/services/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {Ng7BootstrapBreadcrumbModule} from 'ng7-bootstrap-breadcrumb';
import { SafeHtmlModule } from '../../shared/safe-html/safe-html.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TwoColumnsLayoutComponent', () => {
  let component: TwoColumnsLayoutComponent;
  let fixture: ComponentFixture<TwoColumnsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        Ng7BootstrapBreadcrumbModule,
        SafeHtmlModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [
        TwoColumnsLayoutComponent,
      ],
      providers: [
        AuthService, CookieService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoColumnsLayoutComponent);
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
