import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReinitPasswordComponent } from './view/reinit-password.component';

const routes: Routes = [
  // http://uri/reinit
  {
    path: '',
    pathMatch: 'full',
    component: ReinitPasswordComponent,
    data: { title: 'ReinitPassword' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReinitPasswordRoutingModule {}
