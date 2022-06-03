import { NgModule } from '@angular/core';
import { NumberOnlyDirective } from './number-only/number-only.directive';

/**
 * The custom form module
 */
@NgModule({
  declarations: [NumberOnlyDirective],
  exports: [NumberOnlyDirective]
})
export class StgoFormModule {}
