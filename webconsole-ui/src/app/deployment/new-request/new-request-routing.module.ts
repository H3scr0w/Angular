import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewRequestComponent } from './new-request.component';

/**
 * The routes for practice
 */
const routes: Routes = [
  {
    path: '',
    component: NewRequestComponent,
    data: { title: 'New Request' }
  }
];

/**
 * The NewRequest routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewRequestRoutingModule {}
