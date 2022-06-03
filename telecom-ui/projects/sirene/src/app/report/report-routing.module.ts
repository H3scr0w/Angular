import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteReportComponent } from './site-report/site-report.component';

/**
 * The routes
 */
const routes: Routes = [
  { path: '', redirectTo: 'site', pathMatch: 'full' },
  {
    path: 'site',
    component: SiteReportComponent,
    pathMatch: 'full',
    data: { title: 'Site Supervision Report' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
