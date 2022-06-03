import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@core';
import { HomeComponent } from './home.component';

/**
 * The routes for Home
 */
const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
      path: 'home',
      component: HomeComponent,
      pathMatch: 'full',
      data: { title: 'Home' }
    }
  ])
];

/**
 * The home routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule {}
