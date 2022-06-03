import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EmailCustomValidators } from '../../shared/classes/email.validators';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmailOrderDTO } from '../../shared/models/email-order.dto';
import { EmailPreviewDialogDetails } from '../../shared/models/email-preview-dialog-details';
import { EmailRequestDto } from '../../shared/models/email-request-dto';
import { CommandService } from '../../shared/service/commands/command.service';
import { MessageService } from '../../shared/service/message/message.service';
import { RequestService } from '../../shared/service/request/request.service';

@Component({
  selector: 'stgo-order-email-preview-dialog',
  templateUrl: './email-preview-dialog.component.html',
  styleUrls: ['./email-preview-dialog.component.scss']
})
export class EmailPreviewDialogComponent implements OnInit, OnDestroy {
  @Input()
  emailOrder: EmailOrderDTO;
  @Input()
  emailRequest: EmailRequestDto;

  isLoading: boolean;
  isSending: boolean;
  emailPreviewOrder: EmailOrderDTO;
  emailPreviewRequest: EmailRequestDto;
  selectable = true;
  removable = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  emailsTo: string[] = [];
  emailsCC: string[] = [];

  emailOperatorForm = this.fb.group({
    to: [this.emailsTo, [EmailCustomValidators.validateRequired, EmailCustomValidators.validateEmails]],
    cc: [this.emailsCC, [EmailCustomValidators.validateRequired, EmailCustomValidators.validateEmails]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  private sub$: Subscription = new Subscription();

  constructor(
    private commandService: CommandService,
    private requestService: RequestService,
    private messageService: MessageService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<EmailPreviewDialogComponent>,
    public fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: EmailPreviewDialogDetails
  ) {}

  ngOnInit() {
    if (this.emailOrder) {
      this.emailPreviewOrder = this.emailOrder;
      this.fillOperatorForm(this.emailPreviewOrder);
    } else if (this.emailRequest) {
      this.emailPreviewRequest = this.emailRequest;
      this.fillOperatorForm(this.emailPreviewRequest);
    } else if (this.data) {
      if (this.data.mode === 'order') {
        this.getOperatorEmails(this.data.orderId);
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

  sendEmailToOperator(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: false,
      data: this.translateService.instant('request.make.sendCSV.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(isStatusUpdate => {
      if (isStatusUpdate === false || isStatusUpdate === true) {
        if (this.data.mode === 'order') {
          this.isSending = true;
          const email: EmailOrderDTO = new EmailOrderDTO(
            this.emailPreviewOrder.id,
            this.emailOperatorForm.controls.message.value,
            this.emailOperatorForm.controls.to.value.join(),
            this.emailPreviewOrder.network,
            this.emailOperatorForm.controls.cc.value.join(),
            this.emailOperatorForm.controls.subject.value,
            this.emailPreviewOrder.country,
            null,
            null,
            this.emailPreviewOrder.orderIds
          );

          const emails: EmailOrderDTO[] = [email];
          this.sub$.add(
            this.commandService
              .sendEmailOrders(emails, isStatusUpdate)
              .pipe(finalize(() => (this.isSending = false)))
              .subscribe(
                (result: EmailOrderDTO[]) => {
                  if (result) {
                    this.messageService.show(this.translateService.instant('common.save.success.mail'), 'success');
                    if (!this.emailOrder && !this.emailRequest) {
                      this.dialogRef.close();
                    }
                  }
                },
                error => {
                  if (!this.emailOrder && !this.emailRequest) {
                    this.dialogRef.close('error');
                  }
                }
              )
          );
        }
        if (this.data.mode === 'request') {
          this.isSending = true;
          const email: EmailRequestDto = new EmailRequestDto(
            this.emailPreviewRequest.id,
            this.emailOperatorForm.controls.message.value,
            this.emailOperatorForm.controls.to.value.join(),
            this.emailPreviewRequest.network,
            this.emailOperatorForm.controls.cc.value.join(),
            this.emailOperatorForm.controls.subject.value,
            this.emailPreviewRequest.country,
            null,
            null,
            this.emailPreviewRequest.requestIds
          );

          const emails: EmailRequestDto[] = [email];
          this.sub$.add(
            this.requestService
              .sendEmailRequests(emails, isStatusUpdate)
              .pipe(finalize(() => (this.isSending = false)))
              .subscribe(
                (result: EmailRequestDto[]) => {
                  if (result) {
                    this.messageService.show(this.translateService.instant('common.save.success.mail'), 'success');
                    if (!this.emailOrder && !this.emailRequest) {
                      this.dialogRef.close();
                    }
                  }
                },
                error => {
                  if (!this.emailOrder && !this.emailRequest) {
                    this.dialogRef.close('error');
                  }
                }
              )
          );
        }
      }
    });
  }

  onNoClick(): void {
    if (!this.emailOrder && !this.emailRequest) {
      this.dialogRef.close('close');
    }
  }

  add(event: MatChipInputEvent, emailType: string): void {
    const input = event.input;
    const value = event.value;

    const controller = this.emailOperatorForm.controls[emailType];

    if (value.trim() !== '') {
      controller.setErrors(null);
      const tempEmails = controller.value;
      tempEmails.push(value.trim());
      controller.setValue(tempEmails);

      if (emailType === 'to') {
        if (controller.valid) {
          controller.markAsDirty();
          input.value = '';
        } else {
          const index = this.emailsTo.findIndex(email => email === value.trim());
          if (index !== -1) {
            this.emailsTo.splice(index, 1); // 6
          }
        }
      } else if (emailType === 'cc') {
        if (controller.valid) {
          controller.markAsDirty();
          input.value = '';
        } else {
          const index = this.emailsCC.findIndex(email => email === value.trim());
          if (index !== -1) {
            this.emailsCC.splice(index, 1);
          }
        }
      }
      input.value = '';
    } else {
      controller.updateValueAndValidity();
    }
  }

  remove(email: string, emailType: string): void {
    let index = 0;
    const controller = this.emailOperatorForm.controls[emailType];
    if (emailType === 'to') {
      index = this.emailsTo.indexOf(email, 0);
      if (index > -1) {
        this.emailsTo.splice(index, 1);
      }
    } else if (emailType === 'cc') {
      index = this.emailsCC.indexOf(email);
      if (index > -1) {
        this.emailsCC.splice(index, 1);
      }
    }
    controller.updateValueAndValidity();
    controller.markAsDirty();
  }

  downloadOrderCSV(orderId: string): void {
    if (orderId) {
      this.isLoading = true;
      this.sub$.add(
        this.commandService
          .download(orderId)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((csvContent: Blob) => {
            if (csvContent) {
              const blob = new Blob([csvContent], { type: 'application/octet-stream' });
              saveAs(blob, orderId + '.csv');
            }
          })
      );
    }
  }

  downloadRequestCSV(requestId: number): void {
    if (requestId) {
      this.isLoading = true;
      this.sub$.add(
        this.requestService
          .download(requestId)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((csvContent: Blob) => {
            if (csvContent) {
              const blob = new Blob([csvContent], { type: 'application/octet-stream' });
              saveAs(blob, requestId + '.csv');
            }
          })
      );
    }
  }

  private getOperatorEmails(orderIds: string[]): void {
    this.isLoading = true;
    this.sub$.add(
      this.commandService
        .getOperatorEmails(orderIds)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((emailOrders: EmailOrderDTO[]) => {
          if (emailOrders && emailOrders.length >= 1) {
            this.emailPreviewOrder = emailOrders[0];
            this.fillOperatorForm(this.emailPreviewOrder);
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
            this.emailPreviewRequest = emailRequests[0];
            this.fillOperatorForm(this.emailPreviewRequest);
          }
        })
    );
  }

  private fillOperatorForm(emailData: EmailRequestDto | EmailOrderDTO): void {
    if (!emailData) {
      return;
    }

    if (emailData.recipient) {
      emailData.recipient.split(/[;,]/gm).forEach(email => {
        this.emailsTo.push(email);
      });
      this.emailOperatorForm.controls.to.setValue(this.emailsTo);
    }
    if (emailData.carbonCopy) {
      emailData.carbonCopy.split(/[;,]/gm).forEach(email => {
        this.emailsCC.push(email);
      });
      this.emailOperatorForm.controls.cc.setValue(this.emailsCC);
    }

    this.emailOperatorForm.patchValue({
      subject: emailData.objet,
      message: emailData.mailBody
    });
  }
}
