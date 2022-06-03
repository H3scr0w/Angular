import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacilityListComponent } from './facility/facility-list.component';

/**
 * The routes
 */
const routes: Routes = [
  {
    path: '',
    component: FacilityListComponent,
    pathMatch: 'full',
    data: { title: 'Facilities' }
  }
];

/**
 * The email template routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class FacilityRoutingModule {}
