import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@core';
import { WebsiteComponent } from './website.component';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: '/website/wsip-configurations', pathMatch: 'full' },
    {
      path: 'website',
      component: WebsiteComponent,
      children: [
        {
          path: '',
          redirectTo: 'wsip-configurations',
          pathMatch: 'full'
        },
        {
          path: 'wsip-configurations',
          loadChildren: () =>
            import('./wsip-configuration/wsip-configuration.module').then((m) => m.WsipConfigurationModule)
        },
        {
          path: 'infrastructure-configurations',
          loadChildren: () =>
            import('./infrastructure-configuration/infrastructure-configuration.module').then(
              (m) => m.InfrastructureConfigurationModule
            )
        },
        {
          path: 'security-reports',
          loadChildren: () => import('./security-reports/security-reports.module').then((m) => m.SecurityReportsModule)
        }
      ]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule {}
