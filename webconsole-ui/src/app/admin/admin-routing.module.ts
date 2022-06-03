import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'admin-user',
        pathMatch: 'full'
      },
      {
        path: 'admin-user',
        loadChildren: () => import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'admin-wsip',
        loadChildren: () => import('./wsip/wsip.module').then((m) => m.WsipModule)
      },
      {
        path: 'admin-tools',
        loadChildren: () => import('./tools/tools.module').then((m) => m.ToolsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
