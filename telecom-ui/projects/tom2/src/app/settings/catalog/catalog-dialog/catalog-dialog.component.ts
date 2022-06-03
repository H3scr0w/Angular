import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Catalog } from '../../../shared/models/catalog';
import { Contract, ContractDTO } from '../../../shared/models/contracts';
import { CatalogService } from '../../../shared/service/catalog/catalog.service';
import { ContractService } from '../../../shared/service/contract/contract.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { CatalogDialogData } from './catalog-dialog-data';
import { CatalogValidator } from './catalog-validator';

@Component({
  selector: 'stgo-catalog-dialog',
  templateUrl: './catalog-dialog.component.html',
  styleUrls: ['./catalog-dialog.component.css']
})
export class CatalogDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  isContractsLoading = false;
  contractFilter: ContractDTO;
  selectedContract: ContractDTO;
  contracts: Observable<ContractDTO[]>;
  inputContract: Subject<string> = new Subject<string>();

  private sub$: Subscription = new Subscription();

  catalogForm = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(1)]],
    contract: [null, Validators.required],
    comments: ['']
  });

  constructor(
    private messageService: MessageService,
    private contractService: ContractService,
    private catalogService: CatalogService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CatalogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CatalogDialogData
  ) {}

  ngOnInit() {
    this.selectedContract = null;
    this.contracts = this.inputContract.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isContractsLoading = true;
        this.contractFilter = new ContractDTO();
        this.contractFilter.skip = true;
        return this.contractService.getAllContract(0, 50, 'code', 'asc', value, this.contractFilter).pipe(
          finalize(() => (this.isContractsLoading = false)),
          switchMap(result => {
            return of(result.content.sort((a, b) => a.code.localeCompare(b.code)));
          })
        );
      })
    );

    if (this.data && this.data.catalog) {
      this.catalogForm.patchValue({
        id: !this.data.catalog.id ? 0 : this.data.catalog.id,
        name: !this.data.catalog.name ? '' : this.data.catalog.name,
        contract: !this.data.catalog.contract ? null : this.data.catalog.contract,
        comments: !this.data.catalog.comments ? '' : this.data.catalog.comments
      });
      this.catalogForm
        .get('name')
        .setAsyncValidators([
          CatalogValidator.validateCatalogNameNotTaken(
            this.catalogService,
            this.catalogForm,
            this.catalogForm.get('name').value
          )
        ]);
    }
    if (this.data && this.data.mode === 'add') {
      this.catalogForm
        .get('name')
        .setAsyncValidators([
          CatalogValidator.validateCatalogNameNotTaken(
            this.catalogService,
            this.catalogForm,
            this.catalogForm.get('name').value
          )
        ]);

      this.catalogForm.get('contract').setValue(null);
      this.selectedContract = null;
    } else if (this.data && this.data.catalog && this.data.catalog.contract) {
      this.sub$.add(
        this.contractService.getContract(this.data.catalog.contract.id).subscribe(res => {
          this.selectedContract = res;
        })
      );
    }
  }
  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onContractSelected(contractDTO: ContractDTO): void {
    this.selectedContract = null;
    if (contractDTO) {
      this.selectedContract = contractDTO;
    }
  }

  onSubmit(): void {
    if (this.catalogForm.valid && this.selectedContract) {
      this.isLoading = true;
      const contract = new Contract(
        this.selectedContract.id,
        this.selectedContract.code,
        this.selectedContract.operator ? this.selectedContract.operator.id : null
      );
      const catalog: Catalog = new Catalog(
        this.catalogForm.controls.id.value,
        contract,
        this.catalogForm.controls.name.value,
        this.catalogForm.controls.comments.value,
        null
      );
      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.catalogService
            .addCatalog(catalog)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      } else {
        this.sub$.add(
          this.catalogService
            .editCatalog(catalog)
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
      return this.catalogForm.controls[controlName].hasError(errorName);
    }
    return this.catalogForm.controls[controlName].hasError(errorName) && this.catalogForm.controls[controlName].touched;
  };
}
