import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { OrdersModule } from '../orders/orders.module';
import { SharedModule } from '../shared/shared.module';
import { BulkOperatorResponseComponent } from './bulk-operator-response/bulk-operator-response.component';
import { CancellationFolloupListComponent } from './cancellation-folloup/cancellation-folloup-list/cancellation-folloup-list.component';
import { CancellationOrderDialogComponent } from './cancellation-folloup/cancellation-order-dialog/cancellation-order-dialog.component';
import { RequestCancellationDialogComponent } from './request-cancellation/request-cancellation-dialog/request-cancellation-dialog.component';
import { RequestCancellationListComponent } from './request-cancellation/request-cancellation-list/request-cancellation-list.component';
import { RequestFollowupComponent } from './request-followup/request-followup.component';
import { RequestMakeDialogComponent } from './request-make/request-make-dialog/request-make-dialog.component';
import { RequestMakeListComponent } from './request-make/request-make-list/request-make-list.component';
import { RequestTerminationComponent } from './request-termination/request-termination.component';
import { RequestsRoutingModule } from './requests-routing.module';

@NgModule({
  declarations: [
    RequestCancellationListComponent,
    RequestCancellationDialogComponent,
    CancellationFolloupListComponent,
    CancellationOrderDialogComponent,
    RequestMakeListComponent,
    RequestMakeDialogComponent,
    BulkOperatorResponseComponent,
    RequestFollowupComponent,
    RequestTerminationComponent
  ],
  imports: [CommonModule, SharedModule, TranslateModule, RequestsRoutingModule, OrdersModule]
})
export class RequestsModule {}
