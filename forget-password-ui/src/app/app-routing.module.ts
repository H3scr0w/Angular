import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitAccountGuard } from './init-account/shared/init-account.guard';
import { CheckTokenGuard } from './new-password/shared/check-token.guard';
import { ReinitPasswordGuard } from './reinit-password/shared/reinit-password.guard';

/**
 * The routes
 *
 * @type {{path: string; redirectTo: string; pathMatch: string}[]}
 */
const routes: Routes = [
  {
    path: 'success',
    loadChildren: './reinit-password/reinit-password.module#ReinitPasswordModule',
    canLoad: [ReinitPasswordGuard]
  },
  {
    path: 'new/:token',
    loadChildren: './new-password/new-password.module#NewPasswordModule',
    canActivate: [CheckTokenGuard]
  },
  {
    path: 'expired',
    loadChildren: './init-account/init-account.module#InitAccountModule',
    canLoad: [InitAccountGuard]
  },
  // Fallback when no prior route is matched
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

/**
 * The App routing module
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
  providers: [ReinitPasswordGuard]
})
export class AppRoutingModule {}
