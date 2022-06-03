import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGroupGuard } from '../shared/guards/user-group.guard';
import { AcnParameterListComponent } from './acn-parameter/acn-parameter-list/acn-parameter-list.component';
import { CatalogListComponent } from './catalog/catalog-list/catalog-list.component';
import { ContractListComponent } from './contract/contract-list/contract-list.component';
import { CostUpperLimitListComponent } from './cost-upper-limt/cost-upper-limit-list/cost-upper-limit-list.component';
import { ExportTemplateListComponent } from './export-template/export-template-list/export-template-list.component';
import { IspCarrierListComponent } from './isp-carrier/isp-carrier-list/isp-carrier-list.component';
import { LtcTerminationListComponent } from './ltc-termination/ltc-termination-list/ltc-termination-list.component';
import { NetworksListComponent } from './networks/networks-list/networks-list.component';
import { OperatorMailTemplateListComponent } from './operator-mail-template/mail-list/operator-mail-template-list/operator-mail-template-list.component';
import { OperatorParameterListComponent } from './operator-parameter/operator-parameter-list/operator-parameter-list.component';
import { OperatorListComponent } from './operators/operator-list/operator-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'operators', pathMatch: 'full' },
  {
    path: 'access-template-setting',
    component: ExportTemplateListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' },
    canActivate: [UserGroupGuard]
  },
  {
    path: 'operators',
    component: OperatorListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' },
    canActivate: [UserGroupGuard]
  },
  {
    path: 'contracts',
    component: ContractListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' },
    canActivate: [UserGroupGuard]
  },
  {
    path: 'catalogs',
    component: CatalogListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' },
    canActivate: [UserGroupGuard]
  },
  {
    path: 'networks',
    component: NetworksListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' },
    canActivate: [UserGroupGuard]
  },
  {
    path: 'email-template',
    component: OperatorMailTemplateListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' }
  },
  {
    path: 'operator-parameters',
    component: OperatorParameterListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' }
  },
  {
    path: 'isp-carriers',
    component: IspCarrierListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' }
  },
  {
    path: 'ltc-terminations',
    component: LtcTerminationListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' }
  },
  {
    path: 'cost-upper-limits',
    component: CostUpperLimitListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' }
  },
  {
    path: 'acn-parameters',
    component: AcnParameterListComponent,
    pathMatch: 'full',
    data: { title: 'Settings' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
