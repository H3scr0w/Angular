import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Catalog } from '../../../shared/models/catalog';
import { LtcTermination } from '../../../shared/models/ltc-termination';
import { Operator } from '../../../shared/models/operators';
import { Page } from '../../../shared/models/page.model';
import { CatalogService } from '../../../shared/service/catalog/catalog.service';
import { LtcTerminationService } from '../../../shared/service/ltc-termination/ltc-termination.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { LtcTerminationDialogData } from './ltc-termination-dialog-data';
import { LtcTerminationValidator } from './ltc-termination-validator';

@Component({
  selector: 'stgo-ltc-termination-dialog',
  templateUrl: './ltc-termination-dialog.component.html',
  styleUrls: ['./ltc-termination-dialog.component.scss']
})
export class LtcTerminationDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  isEnabled = false;
  operators: Observable<Operator[]>;
  catalogs: Catalog[];
  inputOperator: Subject<string> = new Subject<string>();
  inputCatalog: Subject<string> = new Subject<string>();

  private sub$: Subscription = new Subscription();

  ltcTerminationForm = this.fb.group({
    id: [''],
    operator: [null, Validators.required],
    catalog: [null],
    ltc: [''],
    ltcMonth: ['']
  });
  constructor(
    private messageService: MessageService,
    private operatorsService: OperatorsService,
    private catalogService: CatalogService,
    private ltcTerminationService: LtcTerminationService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LtcTerminationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LtcTerminationDialogData
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

    this.inputCatalog.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe((value: string) => {
      const catalogFilter: Catalog = new Catalog();
      if (this.ltcTerminationForm.controls.operator.value) {
        const selectedOperator: Operator = this.ltcTerminationForm.controls.operator.value;
        if (Operator) {
          catalogFilter.contract.operator = selectedOperator.id;
        }
      }
      if (value) {
        catalogFilter.name = value;
      }
      this.getAllCatalogs(catalogFilter);
    });

    if (this.data) {
      this.ltcTerminationForm.patchValue({
        id: !this.data.ltcTermination.id ? 0 : this.data.ltcTermination.id,
        catalog: !this.data.ltcTermination.catalog ? null : this.data.ltcTermination.catalog,
        operator: !this.data.ltcTermination.operator ? null : this.data.ltcTermination.operator
      });
      if (this.data.ltcTermination.ltc) {
        this.ltcTerminationForm.patchValue({
          ltcMonth: '',
          ltc: this.data.ltcTermination.ltc
        });
        this.ltcTerminationForm.controls.ltcMonth.disable();
      } else if (this.data.ltcTermination.ltcMonth) {
        this.ltcTerminationForm.patchValue({
          ltc: '',
          ltcMonth: this.data.ltcTermination.ltcMonth
        });
        this.ltcTerminationForm.controls.ltc.disable();
      } else {
        this.ltcTerminationForm.patchValue({
          ltcMonth: '',
          ltc: ''
        });
      }
      this.isEnabled = true;
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  validateLtc(event: any) {
    const value: number = event?.target?.value;
    if (value) {
      this.ltcTerminationForm.patchValue({
        ltcMonth: '',
        ltc: value
      });
      this.ltcTerminationForm.controls.ltcMonth.disable();
    } else {
      this.ltcTerminationForm.controls.ltcMonth.enable();
    }
    this.checkValid();
  }

  validateLtcDays(event: any) {
    const value: number = event?.target?.value;
    if (value) {
      this.ltcTerminationForm.patchValue({
        ltc: '',
        ltcMonth: value
      });
      this.ltcTerminationForm.controls.ltc.disable();
    } else {
      this.ltcTerminationForm.controls.ltc.enable();
    }
    this.checkValid();
  }

  checkValid(): void {
    if (
      this.ltcTerminationForm.get('operator').value &&
      (this.ltcTerminationForm.get('ltc').value || this.ltcTerminationForm.get('ltcMonth').value)
    ) {
      this.isEnabled = true;
    } else {
      this.isEnabled = false;
    }
  }

  onSubmit(): void {
    if (this.ltcTerminationForm.valid && this.isEnabled) {
      this.isLoading = true;
      const operator: Operator = this.ltcTerminationForm.controls.operator.value;
      const catalog: Catalog = this.ltcTerminationForm.controls.catalog.value;

      const ltcTermination: LtcTermination = new LtcTermination(
        this.ltcTerminationForm.controls.id.value,
        operator.id,
        catalog ? catalog.id : null,
        this.ltcTerminationForm.controls.ltc.value,
        this.ltcTerminationForm.controls.ltcMonth.value
      );
      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.ltcTerminationService
            .addLtcTermination(ltcTermination)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      } else {
        this.sub$.add(
          this.ltcTerminationService
            .editLtcTermination(ltcTermination)
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
      return this.ltcTerminationForm.controls[controlName].hasError(errorName);
    }
    return (
      this.ltcTerminationForm.controls[controlName].hasError(errorName) &&
      this.ltcTerminationForm.controls[controlName].touched
    );
  };

  onOperatorSelected(operator: Operator): void {
    if (operator) {
      this.ltcTerminationForm.patchValue({
        catalog: null
      });
      const catalogFilter: Catalog = new Catalog();
      catalogFilter.contract.operator = operator.id;
      this.getAllCatalogs(catalogFilter);
    }
    this.checkValid();
  }

  onCatalogSelected(): void {
    this.ltcTerminationForm
      .get('catalog')
      .setAsyncValidators([
        LtcTerminationValidator.validateCatalogNameNotTaken(this.ltcTerminationService, this.ltcTerminationForm)
      ]);
  }

  private getAllCatalogs(catalogFilter?: Catalog): void {
    this.isLoading = true;
    this.sub$.add(
      this.catalogService
        .getAllCatalogs(0, 50, 'name', 'asc', '', catalogFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Catalog>) => {
          if (page) {
            this.catalogs = page.content.sort((a, b) => a.name.localeCompare(b.name));
          }
        })
    );
  }
}
