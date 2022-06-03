import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { RequestType } from '../../../shared/enums/enum';
import { TelecomService } from '../../../shared/models/telecom-service-selector';
import { MessageService } from '../../../shared/service/message/message.service';
import { IOrderResultData } from '../order-make-dialog/order-make-dialog-data';
import { OrderMakeDialogComponent } from '../order-make-dialog/order-make-dialog.component';
import { OrderNotifyDialogComponent } from '../order-notify-dialog/order-notify-dialog.component';

@Component({
  selector: 'stgo-order-make-list',
  templateUrl: './order-make-list.component.html',
  styleUrls: ['./order-make-list.component.css']
})
export class OrderMakeListComponent {
  isLoading = false;

  constructor(
    public messageService: MessageService,
    private translateService: TranslateService,
    public dialog: MatDialog
  ) {}

  onServiceSelected(service: TelecomService): void {
    const dialogRef = this.dialog.open(OrderMakeDialogComponent, {
      width: '1000px',
      data: { mode: 'add', requestType: RequestType.Order, telecomService: service },
      disableClose: true,
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        const orderResult: IOrderResultData = result;
        if (orderResult && orderResult.orderId) {
          if (orderResult.isAnyError) {
            this.messageService.showWithAction(
              this.translateService.instant('order.make.success.partially.message', { orderId: result.orderId })
            );
          } else {
            this.messageService.showWithAction(
              this.translateService.instant('order.make.success.message', { orderId: result.orderId })
            );
          }
          this.orderNotify(orderResult.orderId);
        }
      }
    });
  }

  orderNotify(orderId: string): void {
    const dialogRef = this.dialog.open(OrderNotifyDialogComponent, {
      width: '820px',
      disableClose: true,
      data: orderId
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'error') {
        this.messageService.show(this.translateService.instant('common.save.failed.mail'), 'error');
      } else if (result !== 'close') {
        this.messageService.show(this.translateService.instant('common.save.success.mail'));
      }
    });
  }
}
