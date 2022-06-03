import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from './app.module';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {AuthService} from './core/services/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {ApiNotarialeService} from './core/services/api-notariale.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        NgxSpinnerModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
        TranslateService,
        NgxSpinnerService,
        AuthService,
        CookieService,
        ApiNotarialeService,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend-caf'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('frontend-caf');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
