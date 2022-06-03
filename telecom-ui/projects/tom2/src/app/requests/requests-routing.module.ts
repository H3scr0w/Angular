import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkOperatorResponseComponent } from './bulk-operator-response/bulk-operator-response.component';
import { CancellationFolloupListComponent } from './cancellation-folloup/cancellation-folloup-list/cancellation-folloup-list.component';
import { RequestCancellationListComponent } from './request-cancellation/request-cancellation-list/request-cancellation-list.component';
import { RequestFollowupComponent } from './request-followup/request-followup.component';
import { RequestMakeListComponent } from './request-make/request-make-list/request-make-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'cancellation-follow-up', pathMatch: 'full' },
  {
    path: 'request-follow-up',
    component: RequestFollowupComponent,
    pathMatch: 'full',
    data: { title: 'Requests' }
  },
  {
    path: 'request-follow-up/:id',
    component: RequestFollowupComponent,
    pathMatch: 'full',
    data: { title: 'Requests' }
  },
  {
    path: 'cancellation-follow-up',
    component: CancellationFolloupListComponent,
    pathMatch: 'full',
    data: { title: 'Requests' }
  },
  {
    path: 'cancellation',
    component: RequestCancellationListComponent,
    pathMatch: 'full',
    data: { title: 'Requests' }
  },
  {
    path: 'make',
    component: RequestMakeListComponent,
    pathMatch: 'full',
    data: { title: 'Make a Request' }
  },
  {
    path: 'bulk-operator-response',
    component: BulkOperatorResponseComponent,
    pathMatch: 'full',
    data: { title: 'Bulk Operator Response' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule {}
