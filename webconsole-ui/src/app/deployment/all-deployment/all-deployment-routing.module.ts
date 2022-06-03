import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllDeploymentComponent } from './all-deployment.component';

/**
 * The routes for practice
 */
const routes: Routes = [
  {
    path: '',
    component: AllDeploymentComponent,
    data: { title: 'All Deployment' }
  }
];

/**
 * The PendingDeployment routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllDeploymentRoutingModule {}
