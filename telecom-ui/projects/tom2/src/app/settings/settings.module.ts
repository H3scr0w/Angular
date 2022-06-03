import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared';
import { AcnParameterDialogComponent } from './acn-parameter/acn-parameter-dialog/acn-parameter-dialog.component';
import { AcnParameterListComponent } from './acn-parameter/acn-parameter-list/acn-parameter-list.component';
import { CatalogDialogComponent } from './catalog/catalog-dialog/catalog-dialog.component';
import { CatalogListComponent } from './catalog/catalog-list/catalog-list.component';
import { ContractDialogComponent } from './contract/contract-dialog/contract-dialog.component';
import { ContractListComponent } from './contract/contract-list/contract-list.component';
import { CostUpperLimitDialogComponent } from './cost-upper-limt/cost-upper-limit-dialog/cost-upper-limit-dialog.component';
import { CostUpperLimitListComponent } from './cost-upper-limt/cost-upper-limit-list/cost-upper-limit-list.component';
import { ExportTemplateListComponent } from './export-template/export-template-list/export-template-list.component';
import { IspCarrierDialogComponent } from './isp-carrier/isp-carrier-dialog/isp-carrier-dialog.component';
import { IspCarrierListComponent } from './isp-carrier/isp-carrier-list/isp-carrier-list.component';
import { LtcTerminationDialogComponent } from './ltc-termination/ltc-termination-dialog/ltc-termination-dialog.component';
import { LtcTerminationListComponent } from './ltc-termination/ltc-termination-list/ltc-termination-list.component';
import { NetworksDialogComponent } from './networks/networks-dialog/networks-dialog.component';
import { NetworksListComponent } from './networks/networks-list/networks-list.component';
import { OperatorMailTemplateDialogComponent } from './operator-mail-template/mail-dialog/operator-mail-template-dialog/operator-mail-template-dialog.component';
import { OperatorMailTemplateListComponent } from './operator-mail-template/mail-list/operator-mail-template-list/operator-mail-template-list.component';
import { OperatorParameterDialogComponent } from './operator-parameter/operator-parameter-dialog/operator-parameter-dialog.component';
import { OperatorParameterListComponent } from './operator-parameter/operator-parameter-list/operator-parameter-list.component';
import { OperatorDialogComponent } from './operators/operator-dialog/operator-dialog.component';
import { OperatorListComponent } from './operators/operator-list/operator-list.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    OperatorListComponent,
    OperatorDialogComponent,
    ContractListComponent,
    NetworksListComponent,
    ContractDialogComponent,
    CatalogListComponent,
    CatalogDialogComponent,
    NetworksDialogComponent,
    ExportTemplateListComponent,
    OperatorMailTemplateListComponent,
    OperatorMailTemplateDialogComponent,
    OperatorParameterListComponent,
    OperatorParameterDialogComponent,
    IspCarrierListComponent,
    IspCarrierDialogComponent,
    LtcTerminationListComponent,
    LtcTerminationDialogComponent,
    CostUpperLimitDialogComponent,
    CostUpperLimitListComponent,
    AcnParameterDialogComponent,
    AcnParameterListComponent
  ],
  imports: [CommonModule, SharedModule, TranslateModule, SettingsRoutingModule]
})
export class SettingsModule {}
