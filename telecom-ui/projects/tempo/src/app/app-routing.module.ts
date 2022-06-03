import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * The routes
 */
const routes: Routes = [
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
