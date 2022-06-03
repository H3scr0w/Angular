import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RightsComponent } from './rights/rights.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    data: { title: 'User Management' }
  },
  {
    path: ':email',
    component: RightsComponent,
    data: { title: 'User Rights' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
