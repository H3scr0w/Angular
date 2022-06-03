import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestBulkSiteComponent } from './request-bulk-site/request-bulk-site.component';
import { RequestSelectorComponent } from './request-selector/request-selector.component';

const routes: Routes = [
  { path: '', redirectTo: 'make-a-request', pathMatch: 'full' },
  {
    path: 'make-a-request',
    component: RequestSelectorComponent,
    pathMatch: 'full',
    data: { title: 'Make a Request' }
  },
  {
    path: 'bulk-site',
    component: RequestBulkSiteComponent,
    pathMatch: 'full',
    data: { title: 'Bulk Site Request' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {}
