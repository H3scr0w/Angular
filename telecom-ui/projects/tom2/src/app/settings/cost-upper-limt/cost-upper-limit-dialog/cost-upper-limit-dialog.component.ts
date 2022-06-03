import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CostUpperLimit } from '../../../shared/models/cost-upper-limit.model';
import { CostUpperLimitService } from '../../../shared/service/cost-upper-limit/cost-upper-limit.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { CostUpperLimitDialogData } from './cost-upper-limit-dialog-data';

@Component({
  selector: 'stgo-cost-upper-limit-dialog',
  templateUrl: './cost-upper-limit-dialog.component.html',
  styleUrls: ['./cost-upper-limit-dialog.component.css']
})
export class CostUpperLimitDialogComponent implements OnInit, OnDestroy {
  isLoading = false;
  setCostUpperLimtForm = this.fb.group({
    id: [''],
    label: [''],
    value: ['']
  });
  private sub$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CostUpperLimitDialogComponent>,
    private messageService: MessageService,
    private translateService: TranslateService,
    private costUpperLimitService: CostUpperLimitService,
    @Inject(MAT_DIALOG_DATA) public data: CostUpperLimitDialogData
  ) {}

  ngOnInit() {
    if (this.data) {
      this.setCostUpperLimtForm.setValue({
        id: this.data.costUpperLimit.id || null,
        label: this.data.costUpperLimit.label || null,
        value: this.data.costUpperLimit.value || null
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  hasError = (controlName: string, errorName: string) => {
    return this.setCostUpperLimtForm.controls[controlName].hasError(errorName);
  };

  onSubmit(): void {
    if (this.setCostUpperLimtForm.valid) {
      this.isLoading = true;
      const costUpperLimit: CostUpperLimit = Object.assign({}, this.setCostUpperLimtForm.value);
      this.sub$.add(
        this.costUpperLimitService
          .updateCostUpperLimit(costUpperLimit)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          })
      );
    }
  }
}
