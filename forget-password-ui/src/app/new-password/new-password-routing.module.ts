import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPasswordComponent } from './view/new-password.component';

const routes: Routes = [
  // http://uri/new
  {
    path: '',
    pathMatch: 'full',
    component: NewPasswordComponent,
    data: { title: 'NewPassword' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewPasswordRoutingModule {}
