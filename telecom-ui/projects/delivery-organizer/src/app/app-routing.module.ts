import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from './core/route.service';
import { UserGroupGuard } from './shared/guards/user-group.guard';

/**
 * The routes
 */
const routes: Routes = [
  Route.withShell([
    {
      path: 'viewedit',
      loadChildren: () => import('./viewedit/viewedit.module').then(m => m.VieweditModule)
    },
    {
      path: 'report',
      loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
    },
    {
      path: 'configuration',
      loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule),
      canLoad: [UserGroupGuard]
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
