import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { CompanyCommentDialogComponent } from './company-comment/company-comment-dialog.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyRoutingModule } from './company-routing.module';

/**
 * The company module
 */
@NgModule({
  imports: [CommonModule, SharedModule, TranslateModule, CompanyRoutingModule],
  declarations: [CompanyListComponent, CompanyCommentDialogComponent]
})
export class CompanyModule {}
