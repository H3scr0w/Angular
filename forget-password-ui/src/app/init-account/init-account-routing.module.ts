import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitAccountComponent } from './view/init-account.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: InitAccountComponent,
    data: { title: 'InitAccount' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitAccountRoutingModule {}
