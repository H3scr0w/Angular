import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NotifySwitchCalcRestitService} from './shared/services/notity-switch-calc-restit.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {HomeModule} from './pages/home/home.module';
import {LayoutModule} from './layout/layout.module';
import {UsufruitModule} from './pages/usufruit/usufruit.module';
import {PretModule} from './pages/pret/pret.module';
import {RefinancementPretModule} from './pages/refinancement-pret/refinancement-pret.module';
import {RachatRenteViagereModule} from './pages/rachat-rente-viagere/rachat-rente-viagere.module';
import {RenteViagereModule} from './pages/rente-viagere/rente-viagere.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from './core/services/auth.service';
import {ApiNotarialeService} from './core/services/api-notariale.service';
import {MentionsLegalesModule} from './pages/mentions-legales/mentions-legales.module';
import {HttpErrorInterceptor} from './core/http-error-interceptor';
import {SessionTimeOutModalComponent} from './shared/session-time-out-modal/session-time-out-modal.component';
import {AlertModule, ModalModule, PopoverModule} from 'ngx-bootstrap';
import {NotifySessionTimeoutServiceService} from './shared/services/notify-session-timeout.service';
import localeFR from '@angular/common/locales/fr';
import {registerLocaleData, DatePipe} from '@angular/common';
import {DeviceDetectorModule} from 'ngx-device-detector';
import { LocaleService } from './shared/services/locale.service';

registerLocaleData(localeFR, 'fr-FR');

@NgModule({
  declarations: [
    AppComponent,
    SessionTimeOutModalComponent,
  ],
  imports: [
    BrowserModule,
    NgxSpinnerModule,
    LayoutModule,
    HomeModule,
    UsufruitModule,
    MentionsLegalesModule,
    PretModule,
    RefinancementPretModule,
    RenteViagereModule,
    RachatRenteViagereModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    ButtonsModule.forRoot(),
    PopoverModule.forRoot(),
    DeviceDetectorModule.forRoot(),
  ],
  providers: [NotifySwitchCalcRestitService, TranslateService, CookieService, AuthService, ApiNotarialeService,
    NotifySessionTimeoutServiceService, DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true},
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR',
      useFactory: (localeService: LocaleService) => {
        return localeService.language;
      },
      deps: [LocaleService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
