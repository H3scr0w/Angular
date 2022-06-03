import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WsipComponent } from './wsip.component';

const routes: Routes = [
  {
    path: '',
    component: WsipComponent,
    data: { title: 'WSIP' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WsipRoutingModule {}
