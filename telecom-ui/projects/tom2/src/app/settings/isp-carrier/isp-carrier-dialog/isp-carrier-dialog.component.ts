import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IspCarrier } from '../../../shared/models/isp-carrier';
import { IspCarrierService } from '../../../shared/service/isp-carrier/isp-carrier.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { IspCarrierDialogData } from './isp-carrier-dialog-data';
import { IspCarrierValidator } from './isp-carrier-validator';

@Component({
  selector: 'stgo-isp-carrier-dialog',
  templateUrl: './isp-carrier-dialog.component.html',
  styleUrls: ['./isp-carrier-dialog.component.css']
})
export class IspCarrierDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  private sub$: Subscription = new Subscription();

  ispCarrierForm = this.fb.group({
    id: [''],
    ispCarrier: ['', [Validators.required, Validators.minLength(1)]],
    ispHelpdeskContact: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    private messageService: MessageService,
    private ispCarrierService: IspCarrierService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IspCarrierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IspCarrierDialogData
  ) {}

  ngOnInit() {
    if (this.data) {
      this.ispCarrierForm.patchValue({
        id: !this.data.ispCarrier.id ? 0 : this.data.ispCarrier.id,
        ispCarrier: !this.data.ispCarrier.ispCarrier ? '' : this.data.ispCarrier.ispCarrier,
        ispHelpdeskContact: !this.data.ispCarrier.ispHelpdeskContact ? null : this.data.ispCarrier.ispHelpdeskContact
      });

      this.ispCarrierForm
        .get('ispCarrier')
        .setAsyncValidators([
          IspCarrierValidator.validateIspCarrierNotTaken(
            this.ispCarrierService,
            this.ispCarrierForm,
            this.ispCarrierForm.get('ispCarrier').value
          )
        ]);
    } else {
      this.ispCarrierForm
        .get('ispCarrier')
        .setAsyncValidators([
          IspCarrierValidator.validateIspCarrierNotTaken(this.ispCarrierService, this.ispCarrierForm, null)
        ]);
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.ispCarrierForm.valid) {
      this.isLoading = true;
      const ispCarrier: IspCarrier = new IspCarrier(
        this.ispCarrierForm.controls.id.value,
        this.ispCarrierForm.controls.ispCarrier.value,
        this.ispCarrierForm.controls.ispHelpdeskContact.value
      );
      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.ispCarrierService
            .addIspCarrier(ispCarrier)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      } else {
        this.sub$.add(
          this.ispCarrierService
            .editIspCarrier(ispCarrier)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  hasError = (controlName: string, errorName: string) => {
    if (this.data && this.data.mode === 'edit') {
      return this.ispCarrierForm.controls[controlName].hasError(errorName);
    }
    return (
      this.ispCarrierForm.controls[controlName].hasError(errorName) && this.ispCarrierForm.controls[controlName].touched
    );
  };
}
