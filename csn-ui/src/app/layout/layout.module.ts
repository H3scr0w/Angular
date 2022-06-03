import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { OneColumnLayoutComponent } from './one-column-layout/one-column-layout.component';
import { TwoColumnsLayoutComponent } from './two-columns-layout/two-columns-layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { SafeHtmlModule } from '../shared/safe-html/safe-html.module';
import { RouterTestingModule } from '@angular/router/testing';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    TranslateModule,
    ClickOutsideModule,
    Ng7BootstrapBreadcrumbModule,
    SafeHtmlModule,
    RouterTestingModule,
  ],
  exports: [],
  declarations: [
    HeaderComponent,
    FooterComponent,
    OneColumnLayoutComponent,
    TwoColumnsLayoutComponent,
  ],
})
export class LayoutModule { }
