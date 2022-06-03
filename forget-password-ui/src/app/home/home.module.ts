import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { environment } from '@env/environment';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './view/home.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    TranslateModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  declarations: [HomeComponent],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.siteKey } as RecaptchaSettings
    }
  ]
})
export class HomeModule {}
