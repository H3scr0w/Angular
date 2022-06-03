import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfrastructureConfigurationComponent } from './infrastructure-configuration.component';

/**
 * The routes for practice
 */
const routes: Routes = [
  {
    path: '',
    component: InfrastructureConfigurationComponent,
    data: { title: 'Infrastructure Configuration' }
  }
];

/**
 * The InfrastructureConfiguration routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfrastructureConfigurationRoutingModule {}
