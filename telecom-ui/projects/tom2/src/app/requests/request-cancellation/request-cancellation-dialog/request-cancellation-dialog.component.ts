import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RequestCancellation } from '../../../shared/models/request-cancellation';
import { RequestCancellationStatus } from '../../../shared/models/request-cancellation-status';
import { CancellationRequestService } from '../../../shared/service/cancellation-request/cancellation-request.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { RequestCancellationDialogData } from './request-cancellation-dialog-data';

@Component({
  selector: 'stgo-request-cancellation-dialog',
  templateUrl: './request-cancellation-dialog.component.html',
  styleUrls: ['./request-cancellation-dialog.component.css']
})
export class RequestCancellationDialogComponent implements OnInit, OnDestroy {
  isLoading = false;
  private sub$: Subscription = new Subscription();

  requestCancellationForm = this.fb.group({
    amount: [null, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RequestCancellationDialogComponent>,
    private messageService: MessageService,
    private translateService: TranslateService,
    private requestCancellationService: CancellationRequestService,
    @Inject(MAT_DIALOG_DATA) public data: RequestCancellationDialogData
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  onSubmit(): void {
    if (this.requestCancellationForm.valid) {
      this.isLoading = true;
      const requestCancellation: RequestCancellation = Object.assign({}, this.requestCancellationForm.value);
      requestCancellation.orderId = this.data.commands.orderId;
      requestCancellation.status = RequestCancellationStatus.Pending;
      this.sub$.add(
        this.requestCancellationService
          .cancelRequest(requestCancellation)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          })
      );
    }
  }
}
