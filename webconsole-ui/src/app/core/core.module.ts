import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthenticationService } from './authentication/authentication.service';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { TokenInterceptor } from './http/token.interceptor';
import { RouteReusableStrategy } from './route-reusable-strategy';
import { ShellComponent } from './shell/shell.component';
import { WebsiteEffect } from './webconsole/website.effect';
import { websiteReducer } from './webconsole/website.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forRoot(
      {
        website: websiteReducer
      },
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false
        }
      }
    ),
    EffectsModule.forRoot([WebsiteEffect])
  ],
  declarations: [ShellComponent],
  providers: [
    AuthenticationGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    }
  ],
  exports: []
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
