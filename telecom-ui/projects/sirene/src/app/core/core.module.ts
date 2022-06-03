import { CommonModule, DOCUMENT } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { NB_DOCUMENT, StgoCommonModule } from '@delivery/stgo-common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthenticationService } from './authentication/authentication.service';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { TokenInterceptor } from './http/token.interceptor';
import { RouteReusableStrategy } from './route-reusable-strategy';
import { StgoMatPaginatorIntl } from './services/stgo-mat-paginator-intl';
import { ShellComponent } from './shell/shell.component';

@NgModule({
  imports: [CommonModule, TranslateModule, RouterModule, StgoCommonModule, SharedModule],
  declarations: [ShellComponent],
  providers: [
    AuthenticationGuard,
    AuthenticationService,
    { provide: NB_DOCUMENT, useExisting: DOCUMENT },
    {
      provide: MatPaginatorIntl,
      useClass: StgoMatPaginatorIntl
    },
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
