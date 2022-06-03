import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { IncapsulaSiteComponent } from './incapsula/incapsula-site/incapsula-site.component';
import { CreateReportDialogComponent } from './qualys/report/create-report-dialog/create-report-dialog.component';
import { ReportComponent } from './qualys/report/report.component';
import { LaunchScanDialogComponent } from './qualys/scan/launch-scan-dialog/launch-scan-dialog.component';
import { ScanComponent } from './qualys/scan/scan.component';
import { EditWebappDialogComponent } from './qualys/webapp/edit-webapp-dialog/edit-webapp-dialog.component';
import { WebappComponent } from './qualys/webapp/webapp.component';
/* tslint:disable-next-line */
import { AddWebAppAuthRecordDialogComponent } from './qualys/webappauthrecord/add-webappauthrecord-dialog/add-webappauthrecord-dialog.component';
/* tslint:disable-next-line */
import { AddServerRecordDialogComponent } from './qualys/webappauthrecord/serverrecord/add-serverrecord-dialog/add-serverrecord-dialog.component';
import { ServerRecordComponent } from './qualys/webappauthrecord/serverrecord/serverrecord.component';
import { WebappauthrecordComponent } from './qualys/webappauthrecord/webappauthrecord.component';
import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsComponent } from './tools.component';

@NgModule({
  declarations: [
    ToolsComponent,
    WebappComponent,
    WebappauthrecordComponent,
    ScanComponent,
    ReportComponent,
    AddWebAppAuthRecordDialogComponent,
    ServerRecordComponent,
    AddServerRecordDialogComponent,
    EditWebappDialogComponent,
    LaunchScanDialogComponent,
    CreateReportDialogComponent,
    IncapsulaSiteComponent
  ],
  imports: [CommonModule, ToolsRoutingModule, SharedModule]
})
export class ToolsModule {}
