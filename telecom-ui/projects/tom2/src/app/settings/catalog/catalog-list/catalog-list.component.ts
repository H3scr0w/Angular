import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../core';
import { Catalog } from '../../../shared/models/catalog';
import { Contract, ContractDTO } from '../../../shared/models/contracts';
import { Page } from '../../../shared/models/page.model';
import { CatalogService } from '../../../shared/service/catalog/catalog.service';
import { ContractService } from '../../../shared/service/contract/contract.service';
import { CatalogDialogComponent } from '../catalog-dialog/catalog-dialog.component';

@Component({
  selector: 'stgo-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.css']
})
export class CatalogListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  isContractsLoading = false;
  catalogs: Catalog[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = ['name', 'code', 'comments', 'actions'];
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;
  panelFilterOpenState = false;
  advanceFilter: Catalog;
  contractFilter: ContractDTO;
  contracts: Observable<ContractDTO[]>;

  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();
  inputContract: Subject<string> = new Subject<string>();

  catalogAdvanceFilterForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    contract: [null, Validators.required]
  });

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private contractService: ContractService,
    private catalogService: CatalogService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isPmUser = this.authenticationService.credentials.isPmUser;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;

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

    this.sub$.add(
      this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchValue => {
        this.searchValue = searchValue;
        this.resetAdvanceFilter();
      })
    );
  }

  ngAfterViewInit(): void {
    this.getAllCatalogs('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllCatalogs(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllCatalogs(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  addCatalog(): void {
    const dialogRef = this.dialog.open(CatalogDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'add', catalog: new Catalog() }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllCatalogs(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editCatalog(data: Catalog): void {
    const dialogRef = this.dialog.open(CatalogDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'edit', catalog: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllCatalogs(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
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
    let contract: Contract;
    const contractDTO: ContractDTO = this.catalogAdvanceFilterForm.controls.contract.value;
    if (contractDTO) {
      contract = new Contract(contractDTO.id, contractDTO.code, contractDTO.operator ? contractDTO.operator.id : null);
    }
    const catalog: Catalog = new Catalog(
      null,
      contract != null ? contract : null,
      this.catalogAdvanceFilterForm.controls.name.value,
      null,
      null
    );
    this.advanceFilter = catalog;
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllCatalogs(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.catalogAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.pageIndex = 0;
    this.getAllCatalogs(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  private countAdvanceFilter(catalogFilter: Catalog): void {
    this.filterCount = 0;
    if (catalogFilter) {
      if (catalogFilter.name) {
        this.filterCount++;
      }
      if (catalogFilter.contract) {
        this.filterCount++;
      }
    }
  }

  private getAllCatalogs(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    catalogFilter?: Catalog
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.catalogService
        .getAllCatalogs(this.pageIndex, this.pageSize, sortField, sortDirection, search, catalogFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Catalog>) => {
          if (page) {
            this.catalogs = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
