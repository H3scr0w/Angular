import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@core';
import { NotAuthorizeComponent } from './not-authorize.component';

/**
 * The routes for Home
 */
const routes: Routes = [
  Route.withoutGuardShell([
    {
      path: 'not-authorize',
      component: NotAuthorizeComponent,
      pathMatch: 'full',
      data: { title: 'Not Authorize' }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class NotAuthorizeRoutingModule {}
