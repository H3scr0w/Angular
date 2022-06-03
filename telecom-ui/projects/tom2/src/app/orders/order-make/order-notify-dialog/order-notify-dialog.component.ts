import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../../../../tempo/src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmailCustomValidators } from '../../../shared/classes/email.validators';
import { IEmailNotifyDTO } from '../../../shared/models/email-notify';
import { CommandService } from '../../../shared/service/commands/command.service';

@Component({
  selector: 'stgo-order-notify-dialog',
  templateUrl: './order-notify-dialog.component.html',
  styleUrls: ['./order-notify-dialog.component.css']
})
export class OrderNotifyDialogComponent implements OnInit, OnDestroy {
  isLoading = false;
  selectable = true;
  removable = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  emailsTo: string[] = [];
  emailsCC: string[] = [];

  emailNotifyForm = this.fb.group({
    to: [this.emailsTo, [EmailCustomValidators.validateRequired, EmailCustomValidators.validateEmails]],
    cc: [this.emailsCC, [EmailCustomValidators.validateRequired, EmailCustomValidators.validateEmails]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  private sub$: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<OrderNotifyDialogComponent>,
    public fb: FormBuilder,
    private commandService: CommandService,
    private translateService: TranslateService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit() {
    if (this.data) {
      this.getOrderToNotify(this.data);
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  notifyOrder(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.notify.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        const emailNotifyDTO: IEmailNotifyDTO = {
          to: this.emailNotifyForm.controls.to.value.join(),
          cc: this.emailNotifyForm.controls.cc.value.join(),
          subject: this.emailNotifyForm.controls.subject.value,
          message: this.emailNotifyForm.controls.message.value
        };
        this.sub$.add(
          this.commandService
            .notifyOrder(this.data, emailNotifyDTO)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(
              (notify: IEmailNotifyDTO) => {
                if (notify) {
                  this.dialogRef.close();
                }
              },
              error => {
                this.dialogRef.close('error');
              }
            )
        );
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  add(event: MatChipInputEvent, emailType: string): void {
    const input = event.input;
    const value = event.value;

    const controller = this.emailNotifyForm.controls[emailType];

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
    const controller = this.emailNotifyForm.controls[emailType];
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

  private getOrderToNotify(orderIds: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.commandService
        .getOrderToNotify(orderIds)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((result: IEmailNotifyDTO) => {
          if (result) {
            if (result.to) {
              result.to.split(/[;,]/gm).forEach(email => {
                this.emailsTo.push(email);
              });
              this.emailNotifyForm.controls.to.setValue(this.emailsTo);
            }
            if (result.cc) {
              result.cc.split(/[;,]/gm).forEach(email => {
                this.emailsCC.push(email);
              });
              this.emailNotifyForm.controls.cc.setValue(this.emailsCC);
            }

            this.emailNotifyForm.patchValue({
              subject: result.subject,
              message: result.message
            });
          }
        })
    );
  }
}
