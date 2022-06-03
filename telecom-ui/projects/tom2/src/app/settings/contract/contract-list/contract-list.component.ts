import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../core';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Contract, ContractDTO } from '../../../shared/models/contracts';
import { Operator } from '../../../shared/models/operators';
import { Page } from '../../../shared/models/page.model';
import { ContractService } from '../../../shared/service/contract/contract.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { ContractDialogComponent } from '../contract-dialog/contract-dialog.component';

@Component({
  selector: 'stgo-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  contracts: ContractDTO[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = ['code', 'operator', 'actions'];
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;
  panelFilterOpenState = false;
  advanceFilter: ContractDTO;
  operators: Observable<Operator[]>;

  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();
  inputOperator: Subject<string> = new Subject<string>();

  contractAdvanceFilterForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(1)]],
    operator: [null, Validators.required]
  });

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private operatorsService: OperatorsService,
    private contractService: ContractService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isPmUser = this.authenticationService.credentials.isPmUser;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;

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

    this.sub$.add(
      this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchValue => {
        this.searchValue = searchValue;
        this.resetAdvanceFilter();
      })
    );
  }

  ngAfterViewInit() {
    this.getAllContracts('code', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllContracts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllContracts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  addContract(): void {
    const dialogRef = this.dialog.open(ContractDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'add', contract: new Contract() }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllContracts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editContract(data: Contract): void {
    const dialogRef = this.dialog.open(ContractDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'edit', contract: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllContracts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  deleteContract(contract: Contract): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.delete.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && contract) {
        this.isLoading = true;
        this.contractService
          .deleteContract(contract.id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(() => {
            this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
            this.getAllContracts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
          });
      }
    });
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  applyFilter(filterValue: string): void {
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = null;
    }
    this.filter.next(this.searchValue);
  }

  applyAdvanceFilter(): void {
    this.pageIndex = 0;
    this.searchValue = null;
    this.advanceFilter = Object.assign({}, this.contractAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllContracts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.contractAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.pageIndex = 0;
    this.getAllContracts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  private countAdvanceFilter(contractFilter: ContractDTO): void {
    this.filterCount = 0;
    if (contractFilter) {
      if (contractFilter.code) {
        this.filterCount++;
      }
      if (contractFilter.operator) {
        this.filterCount++;
      }
    }
  }

  private getAllContracts(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    contractFilter?: ContractDTO
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.contractService
        .getAllContract(this.pageIndex, this.pageSize, sortField, sortDirection, search, contractFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<ContractDTO>) => {
          if (page) {
            this.contracts = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
