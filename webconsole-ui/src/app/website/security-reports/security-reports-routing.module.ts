import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityReportsComponent } from './security-reports.component';

/**
 * The routes for practice
 */
const routes: Routes = [
  {
    path: '',
    component: SecurityReportsComponent,
    data: { title: 'Security Reports' }
  }
];

/**
 * The SecurityReports routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityReportsRoutingModule {}
