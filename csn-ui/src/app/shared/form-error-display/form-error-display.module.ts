import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormErrorDisplayComponent} from './form-error-display.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [FormErrorDisplayComponent],
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    FormErrorDisplayComponent,
  ],
})
export class FormErrorDisplayModule {
}
