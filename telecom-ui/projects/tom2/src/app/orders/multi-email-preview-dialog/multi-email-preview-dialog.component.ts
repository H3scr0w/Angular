import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Subscription } from 'rxjs/internal/Subscription';
import { EmailOrderDTO } from '../../shared/models/email-order.dto';
import { EmailPreviewDialogDetails } from '../../shared/models/email-preview-dialog-details';
import { EmailRequestDto } from '../../shared/models/email-request-dto';
import { CommandService } from '../../shared/service/commands/command.service';
import { RequestService } from '../../shared/service/request/request.service';

@Component({
  selector: 'stgo-multi-email-preview-dialog',
  templateUrl: './multi-email-preview-dialog.component.html',
  styleUrls: ['./multi-email-preview-dialog.component.css']
})
export class MultiEmailPreviewDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  emailPreviewOrders: EmailOrderDTO[] = [];
  emailPreviewRequests: EmailRequestDto[] = [];
  private sub$: Subscription = new Subscription();

  constructor(
    private commandService: CommandService,
    private requestService: RequestService,
    public dialogRef: MatDialogRef<MultiEmailPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmailPreviewDialogDetails
  ) {}

  ngOnInit() {
    if (this.data) {
      if (this.data.mode === 'order') {
        this.getOrderOperatorEmails(this.data.orderId);
      }
      if (this.data.mode === 'request') {
        this.getRequestOperatorEmails(this.data.requestId);
      }
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  private getOrderOperatorEmails(orderIds: string[]): void {
    this.isLoading = true;
    this.sub$.add(
      this.commandService
        .getOperatorEmails(orderIds)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((emailOrders: EmailOrderDTO[]) => {
          if (emailOrders && emailOrders.length >= 1) {
            this.emailPreviewOrders = emailOrders;
          }
        })
    );
  }

  private getRequestOperatorEmails(requestIds: number[]): void {
    this.isLoading = true;
    this.sub$.add(
      this.requestService
        .getOperatorEmails(requestIds)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((emailRequests: EmailRequestDto[]) => {
          if (emailRequests && emailRequests.length >= 1) {
            this.emailPreviewRequests = emailRequests;
          }
        })
    );
  }
}
