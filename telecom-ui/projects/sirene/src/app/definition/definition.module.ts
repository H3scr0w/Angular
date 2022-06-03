import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { ReferenceModule } from '../reference/reference.module';
import { BulkSiteDialogComponent } from './bulk-site/bulk-site-dialog/bulk-site-dialog.component';
import { BulkSiteListComponent } from './bulk-site/bulk-site-list/bulk-site-list.component';
import { CompanyDialogComponent } from './company/company-dialog/company-dialog.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { ContactDialogComponent } from './contact/contact-dialog/contact-dialog.component';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { DefinitionRoutingModule } from './definition-routing.module';
import { MailingListDialogComponent } from './mailing/mailing-list-dialog/mailing-list-dialog.component';
import { MailingListComponent } from './mailing/mailing-list/mailing-list.component';
import { SiteDialogComponent } from './site/site-dialog/site-dialog.component';
import { SiteListComponent } from './site/site-list/site-list.component';

@NgModule({
  declarations: [
    MailingListComponent,
    MailingListDialogComponent,
    SiteListComponent,
    SiteDialogComponent,
    CompanyListComponent,
    CompanyDialogComponent,
    ContactListComponent,
    ContactDialogComponent,
    BulkSiteListComponent,
    BulkSiteDialogComponent
  ],
  imports: [CommonModule, SharedModule, TranslateModule, DefinitionRoutingModule, ReferenceModule],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ]
})
export class DefinitionModule {}
