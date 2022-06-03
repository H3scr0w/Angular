import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TextAreaPrintComponent} from './text-area-print/text-area-print.component';
import { HeaderPrintComponent } from './header-print/header-print.component';
import { FooterPrintComponent } from './footer-print/footer-print.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TextAreaPrintComponent, HeaderPrintComponent, FooterPrintComponent],
  imports: [
    CommonModule, TranslateModule,
  ],
  exports: [
    TextAreaPrintComponent,
    HeaderPrintComponent,
    FooterPrintComponent,
  ],
})
export class ExportModule {
}
