import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { finalize, map, mergeMap } from 'rxjs/operators';
import { Commands } from '../../../shared/models/commands';
import { OperatorMailTemplate } from '../../../shared/models/operator-mail-template.model';
import { RequestCancellation } from '../../../shared/models/request-cancellation';
import { CommandService } from '../../../shared/service/commands/command.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { OperatorMailTemplateService } from '../../../shared/service/operator-mail/operator-mail-template.service';
import { RequestService } from '../../../shared/service/request/request.service';
import { CancellationOrderDialogData } from './cancellation-order-dialog-data';

@Component({
  selector: 'stgo-cancellation-order-dialog',
  templateUrl: './cancellation-order-dialog.component.html',
  styleUrls: ['./cancellation-order-dialog.component.scss']
})
export class CancellationOrderDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  commandId: number;

  private sub$: Subscription = new Subscription();

  cancellationOrderMailForm = this.fb.group({
    to: ['', [Validators.required]],
    cc: ['', Validators.required],
    subject: ['', Validators.required],
    body: [''],
    orderId: '',
    commandId: ''
  });

  constructor(
    private messageService: MessageService,
    private requestService: RequestService,
    private commandService: CommandService,
    private operatorMailService: OperatorMailTemplateService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CancellationOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CancellationOrderDialogData
  ) {}

  ngOnInit() {
    if (this.data && this.data.mode === 'cancel-order') {
      this.isLoading = true;
      this.sub$.add(
        this.commandService
          .getCommandByOrderId(this.data.requestCancellation.orderId)
          .pipe(
            mergeMap((res: Commands) => this.getOperatorMailTemplate(res.id, res.network)),
            finalize(() => (this.isLoading = false))
          )
          .subscribe(result => {
            if (result) {
              this.cancellationOrderMailForm.patchValue({
                to: result.recipient,
                cc: result.carbonCopy,
                subject: this.data.requestCancellation.orderId + ' / Cancellation',
                body: result.mailBody,
                orderId: this.data.requestCancellation.orderId,
                commandId: this.commandId
              });
            }
          })
      );
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

  onSubmit(): void {
    if (this.cancellationOrderMailForm.valid) {
      this.isLoading = true;
      if (this.data && this.data.mode === 'cancel-order') {
        const requestCancellation: RequestCancellation = Object.assign({}, this.cancellationOrderMailForm.value);
        this.sub$.add(
          this.requestService
            .validateCancellationFollowUpRequest(requestCancellation)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              if (res) {
                this.dialogRef.close();
                this.messageService.show(this.translateService.instant('common.save.success.mail'), 'success');
              } else {
                this.messageService.show(this.translateService.instant('common.save.failed.mail'), 'error');
              }
            })
        );
      }
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return (
      this.cancellationOrderMailForm.controls[controlName].hasError(errorName) &&
      this.cancellationOrderMailForm.controls[controlName].touched
    );
  };

  getOperatorMailTemplate(commandId: number, networkId: number): Observable<OperatorMailTemplate> {
    this.commandId = commandId;
    return this.operatorMailService
      .getOperatorMailTemplateByNetworkAndRequestType(networkId, 'R')
      .pipe(map(result => result));
  }
}
