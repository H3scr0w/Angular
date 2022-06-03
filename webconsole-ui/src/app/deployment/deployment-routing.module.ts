import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeploymentComponent } from './deployment.component';

const routes: Routes = [
  {
    path: '',
    component: DeploymentComponent,
    children: [
      {
        path: '',
        redirectTo: 'new-request',
        pathMatch: 'full'
      },
      {
        path: 'new-request',
        loadChildren: () => import('./new-request/new-request.module').then((m) => m.NewRequestModule)
      },
      {
        path: 'pending-deployment',
        loadChildren: () =>
          import('./pending-deployment/pending-deployment.module').then((m) => m.PendingDeploymentModule)
      },
      {
        path: 'all-deployment',
        loadChildren: () => import('./all-deployment/all-deployment.module').then((m) => m.AllDeploymentModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeploymentRoutingModule {}
