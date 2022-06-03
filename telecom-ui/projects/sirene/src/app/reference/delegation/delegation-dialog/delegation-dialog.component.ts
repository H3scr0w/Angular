import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { Delegation, DelegationService, MessageService } from '@shared';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DelegationDialogData } from './delegation-dialog-data';
import { DelegationValidator } from './delegation-validator';

@Component({
  selector: 'stgo-delegation-dialog',
  templateUrl: './delegation-dialog.component.html',
  styleUrls: ['./delegation-dialog.component.css']
})
export class DelegationDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  private saveSubscription: Subscription;

  delegationForm = this.fb.group({
    id: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(10)],
        asyncValidators: [DelegationValidator.validateDelegationIdNotTaken(this.delegationService, null)],
        updateOn: 'blur'
      }
    ],
    name: [
      '',
      {
        validators: Validators.required,
        asyncValidators: [DelegationValidator.validateDelegationNameNotTaken(this.delegationService, null)]
      }
    ]
  });

  constructor(
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private delegationService: DelegationService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<DelegationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DelegationDialogData
  ) {}

  ngOnInit() {
    if (this.data) {
      this.delegationForm.setValue({
        id: this.data.delegation.id,
        name: this.data.delegation.name
      });
    }
    this.delegationForm
      .get('id')
      .setAsyncValidators([
        DelegationValidator.validateDelegationIdNotTaken(this.delegationService, this.delegationForm.get('id').value)
      ]);
  }

  ngOnDestroy() {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.delegationForm.controls[controlName].hasError(errorName);
  }

  onSubmit(): void {
    if (this.delegationForm.valid) {
      this.isLoading = true;
      const delegation: Delegation = Object.assign({}, this.delegationForm.value);
      delegation.lastUser = this.authenticationService.credentials.sgid;
      if (this.data && this.data.mode === 'add') {
        this.saveSubscription = this.delegationService
          .addDelegation(delegation)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          });
      } else {
        const delegation1: Delegation = Object.assign({}, this.delegationForm.value);
        this.saveSubscription = this.delegationService
          .editDelegation(delegation1)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }
}
