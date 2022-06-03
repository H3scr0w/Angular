import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PasswordEffect } from '@app/core/password/password.effect';
import { passwordReducer } from '@app/core/password/password.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    RouterModule,
    StoreModule.forRoot({
      password: passwordReducer
    }),
    EffectsModule.forRoot([PasswordEffect])
  ],
  exports: [TranslateModule],
  declarations: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
