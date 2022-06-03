import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@core';
import { UserGroupGuard } from './shared/guards/user-group.guard';

/**
 * The routes
 */
const routes: Routes = [
  Route.withShell([
    { path: 'definition', loadChildren: () => import('./definition/definition.module').then(m => m.DefinitionModule) },
    { path: 'reference', loadChildren: () => import('./reference/reference.module').then(m => m.ReferenceModule) },
    { path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule) },
    { path: 'request', loadChildren: () => import('./request/request.module').then(m => m.RequestModule) },
    {
      path: 'supervisor',
      loadChildren: () => import('./supervisor/supervisor.module').then(m => m.SupervisorModule),
      canLoad: [UserGroupGuard]
    },
    { path: 'help', loadChildren: () => import('./help/help.module').then(m => m.HelpModule) }
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
