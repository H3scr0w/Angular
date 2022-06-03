import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupervisorComponent } from './supervisor.component';

const routes: Routes = [
  { path: '', redirectTo: 'requests', pathMatch: 'full' },
  {
    path: 'requests',
    component: SupervisorComponent,
    pathMatch: 'full',
    data: { title: 'Supervisor Request' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisorRoutingModule {}
