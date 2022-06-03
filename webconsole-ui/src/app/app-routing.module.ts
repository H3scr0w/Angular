import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@core';
import { AuthenticationGuard } from './core/authentication/authentication.guard';

/**
 * The routes
 */
const routes: Routes = [
  Route.withShell([
    {
      path: 'deployment',
      loadChildren: () => import('./deployment/deployment.module').then((m) => m.DeploymentModule)
    },
    {
      path: 'admin',
      loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
      canLoad: [AuthenticationGuard]
    }
  ]),
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule)
  },
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
