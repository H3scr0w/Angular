import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManualComponent } from './user-manual/user-manual.component';

/**
 * The routes
 */
const routes: Routes = [
  { path: '', redirectTo: 'user-manual', pathMatch: 'full' },
  {
    path: 'user-manual',
    component: UserManualComponent,
    pathMatch: 'full',
    data: { title: 'User Manual' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule {}
