import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { ReportRoutingModule } from './report-routing.module';
import { SiteReportComponent } from './site-report/site-report.component';

@NgModule({
  declarations: [SiteReportComponent],
  imports: [CommonModule, ReportRoutingModule, SharedModule, TranslateModule]
})
export class ReportModule {}
