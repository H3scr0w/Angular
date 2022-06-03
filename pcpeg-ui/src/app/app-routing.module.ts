import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@core';

/**
 * The routes
 */
const routes: Routes = [
  Route.withShell([
    {
      path: 'admin/companies',
      loadChildren: () => import('./admin/company/company.module').then((m) => m.CompanyModule)
    },
    {
      path: 'admin',
      loadChildren: () => import('./admin/campaign/campaign.module').then((m) => m.CampaignModule)
    },
    {
      path: 'admin/funds',
      loadChildren: () => import('./admin/funds/funds.module').then((m) => m.FundsModule)
    },
    {
      path: 'admin/email-templates',
      loadChildren: () => import('./admin/email-templates/email-templates.module').then((m) => m.EmailTemplatesModule)
    },
    {
      path: 'admin/facility',
      loadChildren: () => import('./admin/facility/facility.module').then((m) => m.FacilityModule)
    },
    {
      path: 'parameters',
      loadChildren: () => import('./parameters/parameters.module').then((m) => m.ParametersModule)
    }
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

/**
 * The App routing module
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
