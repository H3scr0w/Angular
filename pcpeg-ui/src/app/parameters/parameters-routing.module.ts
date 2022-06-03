import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanySettingListComponent } from './company-setting-list/company-setting-list.component';
import { CompanySettingStepperComponent } from './company-setting-stepper/company-setting-stepper.component';

const routes: Routes = [
  {
    path: '',
    component: CompanySettingListComponent,
    pathMatch: 'full',
    data: { title: 'Company List Parameters' }
  },
  {
    path: 'company',
    component: CompanySettingStepperComponent,
    pathMatch: 'full',
    data: { title: 'Company Parameters' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametersRoutingModule {}
