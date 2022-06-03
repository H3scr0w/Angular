import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WsipConfigurationComponent } from './wsip-configuration.component';

/**
 * The routes for practice
 */
const routes: Routes = [
  {
    path: '',
    component: WsipConfigurationComponent,
    data: { title: 'Wsip Configuration' }
  }
];

/**
 * The WsipConfiguration routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WsipConfigurationRoutingModule {}
