import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundsComponent } from './funds/funds.component';

/**
 * The routes
 */
const routes: Routes = [
  {
    path: '',
    component: FundsComponent,
    pathMatch: 'full',
    data: { title: 'Funds' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundsRoutingModule {}
