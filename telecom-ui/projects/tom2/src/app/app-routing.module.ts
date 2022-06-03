import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@core';
import { UserGroupGuard } from './shared/guards/user-group.guard';

/**
 * The routes
 */
const routes: Routes = [
  Route.withShell([
    { path: 'orders', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) },
    {
      path: 'requests',
      loadChildren: () => import('./requests/requests.module').then(m => m.RequestsModule),
      canLoad: [UserGroupGuard]
    },
    { path: 'catalogs', loadChildren: () => import('./catalogs/catalogs.module').then(m => m.CatalogsModule) },
    {
      path: 'settings',
      loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
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
