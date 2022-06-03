import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {CalculatedWithComponent} from './calculated-with.component';

@NgModule({
  declarations: [CalculatedWithComponent],
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    CalculatedWithComponent,
  ],
})
export class CalculatedWithModule {
}
