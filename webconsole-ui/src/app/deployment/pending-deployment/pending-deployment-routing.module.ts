import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingDeploymentComponent } from './pending-deployment.component';

/**
 * The routes for practice
 */
const routes: Routes = [
  {
    path: '',
    component: PendingDeploymentComponent,
    data: { title: 'Pending Deployment' }
  }
];

/**
 * The PendingDeployment routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingDeploymentRoutingModule {}
