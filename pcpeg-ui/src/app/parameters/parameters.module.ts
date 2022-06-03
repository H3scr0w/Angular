import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { CompanySettingListComponent } from './company-setting-list/company-setting-list.component';
import { CompanySettingAuthorityComponent } from './company-setting-stepper/company-setting-authority/company-setting-authority.component';
import { CompanySettingPaymentComponent } from './company-setting-stepper/company-setting-payment/company-setting-payment.component';
import { CompanySettingStepperComponent } from './company-setting-stepper/company-setting-stepper.component';
import { ParametersRoutingModule } from './parameters-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, TranslateModule, ParametersRoutingModule],
  declarations: [
    CompanySettingListComponent,
    CompanySettingStepperComponent,
    CompanySettingPaymentComponent,
    CompanySettingAuthorityComponent
  ]
})
export class ParametersModule {}
