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
import { Catalog } from '../../../shared/models/catalog';
import { LtcTermination, LtcTerminationDTO } from '../../../shared/models/ltc-termination';
import { Operator } from '../../../shared/models/operators';
import { Page } from '../../../shared/models/page.model';
import { CatalogService } from '../../../shared/service/catalog/catalog.service';
import { LtcTerminationService } from '../../../shared/service/ltc-termination/ltc-termination.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { LtcTerminationDialogComponent } from '../ltc-termination-dialog/ltc-termination-dialog.component';

@Component({
  selector: 'stgo-ltc-termination-list',
  templateUrl: './ltc-termination-list.component.html',
  styleUrls: ['./ltc-termination-list.component.scss']
})
export class LtcTerminationListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  ltcTerminations: LtcTerminationDTO[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = ['operator', 'catalog', 'ltc', 'ltcMonth', 'actions'];
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;
  panelFilterOpenState = false;
  advanceFilter: LtcTerminationDTO;
  operators: Observable<Operator[]>;
  catalogs: Catalog[];

  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();
  inputOperator: Subject<string> = new Subject<string>();
  inputCatalog: Subject<string> = new Subject<string>();

  ltcTerminationAdvanceFilterForm = this.fb.group({
    operator: [null, Validators.required],
    catalog: [null, Validators.required]
  });

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private operatorsService: OperatorsService,
    private catalogService: CatalogService,
    private ltcTerminationService: LtcTerminationService,
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

    this.inputCatalog.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe((value: string) => {
      const catalogFilter: Catalog = new Catalog();
      const operator: Operator = this.ltcTerminationAdvanceFilterForm.controls.operator.value;
      if (operator) {
        catalogFilter.contract.operator = operator.id;
      }
      if (value) {
        catalogFilter.name = value;
      }
      this.getAllCatalogs(catalogFilter);
    });

    this.sub$.add(
      this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchValue => {
        this.searchValue = searchValue;
        this.resetAdvanceFilter();
      })
    );
  }

  ngAfterViewInit() {
    this.getAllLtcTermination('operator', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllLtcTermination(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllLtcTermination(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  addLtcTermination(): void {
    const dialogRef = this.dialog.open(LtcTerminationDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'add', ltcTermination: new LtcTermination() }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllLtcTermination(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editLtcTermination(data: LtcTermination): void {
    const dialogRef = this.dialog.open(LtcTerminationDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'edit', ltcTermination: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllLtcTermination(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  deleteContract(ltcTermination: LtcTermination): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.delete.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && ltcTermination) {
        this.isLoading = true;
        this.ltcTerminationService
          .deleteLtcTermination(ltcTermination.id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(() => {
            this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
            this.getAllLtcTermination(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
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
    this.advanceFilter = Object.assign({}, this.ltcTerminationAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllLtcTermination(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.ltcTerminationAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.pageIndex = 0;
    this.getAllLtcTermination(this.sort.active, this.sort.direction, this.searchValue);
    this.getAllCatalogs();
  }

  onOperatorSelected(operator: Operator): void {
    if (operator) {
      this.ltcTerminationAdvanceFilterForm.patchValue({
        catalog: null
      });
      const catalogFilter: Catalog = new Catalog();
      catalogFilter.contract.operator = operator.id;
      this.getAllCatalogs(catalogFilter);
    }
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

  private countAdvanceFilter(advanceFilter: LtcTerminationDTO): void {
    this.filterCount = 0;
    if (advanceFilter) {
      if (advanceFilter.catalog) {
        this.filterCount++;
      }
      if (advanceFilter.operator) {
        this.filterCount++;
      }
    }
  }

  private getAllLtcTermination(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    ltcTerminationFilter?: LtcTerminationDTO
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.ltcTerminationService
        .getAllLtcTermination(this.pageIndex, this.pageSize, sortField, sortDirection, search, ltcTerminationFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<LtcTerminationDTO>) => {
          if (page) {
            this.ltcTerminations = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
