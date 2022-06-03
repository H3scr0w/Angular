import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServerRecordComponent } from './qualys/webappauthrecord/serverrecord/serverrecord.component';
import { ToolsComponent } from './tools.component';

const routes: Routes = [
  {
    path: '',
    component: ToolsComponent,
    data: { title: 'Tools' }
  },
  {
    path: ':webAppAuthRecordId',
    component: ServerRecordComponent,
    data: { title: 'Server Records' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule {}
