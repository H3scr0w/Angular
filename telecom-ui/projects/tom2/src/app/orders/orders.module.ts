import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChangeServicesComponent } from './change-services/change-services.component';

import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { ConfirmationDialogComponent } from '../../../../tempo/src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { TelecomServiceSelectorDialogComponent } from '../shared/components/telecom-service-selector-dialog/telecom-service-selector-dialog.component';
import { StgoFormModule } from '../shared/forms/forms.module';
import { SharedModule } from '../shared/shared.module';
import { CatalogReplacementComponent } from './catalog-replacement/catalog-replacement.component';
import { EmailPreviewDialogComponent } from './email-preview-dialog/email-preview-dialog.component';
import { FollowupComponent } from './followup/followup.component';
import { IspBandwidthComponent } from './isp-bandwidth/isp-bandwidth.component';
import { MultiEmailPreviewDialogComponent } from './multi-email-preview-dialog/multi-email-preview-dialog.component';
import { OrderMakeDialogComponent } from './order-make/order-make-dialog/order-make-dialog.component';
import { OrderMakeListComponent } from './order-make/order-make-list/order-make-list.component';
import { OrderNotifyDialogComponent } from './order-make/order-notify-dialog/order-notify-dialog.component';
import { OrdersRoutingModule } from './orders-routing.module';

@NgModule({
  declarations: [
    FollowupComponent,
    ChangeServicesComponent,
    IspBandwidthComponent,
    CatalogReplacementComponent,
    EmailPreviewDialogComponent,
    MultiEmailPreviewDialogComponent,
    OrderMakeDialogComponent,
    OrderMakeListComponent,
    OrderNotifyDialogComponent,
    ConfirmationDialogComponent,
    TelecomServiceSelectorDialogComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    TranslateModule,
    QuillModule.forRoot({
      modules: {
        toolbar: {
          container: [['bold', 'italic', 'underline'], [{ color: [] }]]
        }
      }
    }),
    StgoFormModule
  ]
})
export class OrdersModule {}
