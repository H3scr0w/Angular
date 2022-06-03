import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Contract } from '../../../shared/models/contracts';
import { Operator } from '../../../shared/models/operators';
import { ContractService } from '../../../shared/service/contract/contract.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { ContractDialogData } from './contract-dialog-data';
import { ContractValidator } from './contract-validator';

@Component({
  selector: 'stgo-contract-dialog',
  templateUrl: './contract-dialog.component.html',
  styleUrls: ['./contract-dialog.component.scss']
})
export class ContractDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  operators: Observable<Operator[]>;
  inputOperator: Subject<string> = new Subject<string>();

  private sub$: Subscription = new Subscription();

  contractForm = this.fb.group({
    id: [''],
    code: ['', [Validators.required, Validators.minLength(1)]],
    operator: ['', Validators.required]
  });

  constructor(
    private messageService: MessageService,
    private operatorsService: OperatorsService,
    private contractService: ContractService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContractDialogData
  ) {}

  ngOnInit() {
    this.operators = this.inputOperator.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.operatorsService.getAllOperators(0, 50, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          })
        );
      })
    );

    if (this.data) {
      this.contractForm.patchValue({
        id: !this.data.contract.id ? 0 : this.data.contract.id,
        code: !this.data.contract.code ? null : this.data.contract.code,
        operator: !this.data.contract.operator ? null : this.data.contract.operator
      });
      this.contractForm
        .get('code')
        .setAsyncValidators([
          ContractValidator.validateContractCodeNotTaken(
            this.contractService,
            this.contractForm,
            this.contractForm.get('code').value
          )
        ]);
    } else {
      this.contractForm
        .get('code')
        .setAsyncValidators([
          ContractValidator.validateContractCodeNotTaken(this.contractService, this.contractForm, null)
        ]);
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.contractForm.valid) {
      this.isLoading = true;
      const operator: Operator = this.contractForm.controls.operator.value;
      const contract: Contract = new Contract(
        this.contractForm.controls.id.value,
        this.contractForm.controls.code.value,
        operator.id
      );
      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.contractService
            .addContract(contract)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      } else {
        this.sub$.add(
          this.contractService
            .editContract(contract)
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
      return this.contractForm.controls[controlName].hasError(errorName);
    }
    return (
      this.contractForm.controls[controlName].hasError(errorName) && this.contractForm.controls[controlName].touched
    );
  };
}
