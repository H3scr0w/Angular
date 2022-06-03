import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { DefinitionModule } from '../definition/definition.module';
import { ReferenceModule } from '../reference/reference.module';
import { RequestBulkSiteComponent } from './request-bulk-site/request-bulk-site.component';
import { RequestCompanyDialogComponent } from './request-company-dialog/request-company-dialog.component';
import { RequestRoutingModule } from './request-routing.module';
import { RequestSelectorComponent } from './request-selector/request-selector.component';
import { RequestSiteCreateDialogComponent } from './request-site-create-dialog/request-site-create-dialog.component';
import { RequestSiteModifyDialogComponent } from './request-site-modify-dialog/request-site-modify-dialog.component';

@NgModule({
  declarations: [
    RequestCompanyDialogComponent,
    RequestSelectorComponent,
    RequestSiteCreateDialogComponent,
    RequestSiteModifyDialogComponent,
    RequestBulkSiteComponent,
    RequestSiteCreateDialogComponent
  ],
  imports: [CommonModule, SharedModule, TranslateModule, RequestRoutingModule, ReferenceModule, DefinitionModule],
  exports: [RequestCompanyDialogComponent]
})
export class RequestModule {}
