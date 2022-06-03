import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { FundsRoutingModule } from './funds-routing.module';
import { FundsComponent } from './funds/funds.component';

/**
 * The funds module
 */
@NgModule({
  imports: [CommonModule, SharedModule, TranslateModule, FundsRoutingModule],
  declarations: [FundsComponent]
})
export class FundsModule {}
