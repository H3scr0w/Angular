import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompanyListComponent } from './company-list/company-list.component';

/**
 * The routes
 */
const routes: Routes = [
  {
    path: '',
    component: CompanyListComponent,
    pathMatch: 'full',
    data: { title: 'Companies' }
  }
];

/**
 * The company routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CompanyRoutingModule {}
