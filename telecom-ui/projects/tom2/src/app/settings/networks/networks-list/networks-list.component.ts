import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { AuthenticationService } from '@core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Networks, NetworksFilter } from '../../../shared/models/networks.model';
import { Operator } from '../../../shared/models/operators';
import { Page } from '../../../shared/models/page.model';
import { NetworksService } from '../../../shared/service/networks/networks.service';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { NetworksDialogComponent } from '../networks-dialog/networks-dialog.component';

@Component({
  selector: 'stgo-networks-list',
  templateUrl: './networks-list.component.html',
  styleUrls: ['./networks-list.component.css']
})
export class NetworksListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  inputOperators: Subject<string> = new Subject<string>();
  advanceFilter: NetworksFilter;
  isLoading = false;
  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  searchValue: string;
  networks: Networks[];
  totalElements: number;
  displayedColumns: string[] = ['code', 'name', 'operator', 'actions'];
  panelFilterOpenState = false;
  operators: Observable<Operator[]>;
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;
  networkAdvanceFilterForm = this.fb.group({
    code: [''],
    name: [''],
    operator: [null]
  });

  constructor(
    private networkService: NetworksService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private operatorService: OperatorsService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isPmUser = this.authenticationService.credentials.isPmUser;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;

    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.pageIndex = 0;
      this.searchValue = searchTextValue;
      this.resetAdvanceFilter();
    });

    this.sub$.add(this.filter$);

    this.operators = this.inputOperators.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        return this.operatorService.getAllOperators(0, 50, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          }),
          finalize(() => (this.isLoading = false))
        );
      })
    );
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.getAllNetworks('id', 'asc');
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllNetworks(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllNetworks(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  editNetwork(data: Networks): void {
    this.dialog
      .open(NetworksDialogComponent, {
        width: '800px',
        disableClose: true,
        data: { networks: data, mode: 'edit' }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.getAllNetworks(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
        }
      });
  }

  addNetwork(): void {
    const dialogRef = this.dialog.open(NetworksDialogComponent, {
      width: '800px',
      disableClose: true,
      data: { networks: new Networks(), mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllNetworks(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  applyFilter(filterValue: string): void {
    if (filterValue && filterValue.length > 0) {
      this.searchValue = filterValue;
    } else {
      this.searchValue = null;
    }
    this.filter.next(this.searchValue);
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  applyAdvanceFilter(): void {
    this.pageIndex = 0;
    this.searchValue = null;
    this.advanceFilter = Object.assign({}, this.networkAdvanceFilterForm.value);
    if (this.advanceFilter.operator) {
      this.advanceFilter.operatorId = this.advanceFilter.operator.id;
    }
    this.countAdvanceFilter();
    this.getAllNetworks(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.networkAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.pageIndex = 0;
    this.countAdvanceFilter();
    this.getAllNetworks(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  private countAdvanceFilter(): void {
    this.filterCount = 0;
    if (this.advanceFilter) {
      if (this.advanceFilter.id) {
        this.filterCount++;
      }
      if (this.advanceFilter.code) {
        this.filterCount++;
      }
      if (this.advanceFilter.name) {
        this.filterCount++;
      }
      if (this.advanceFilter.operator) {
        this.filterCount++;
      }
    }
  }

  private getAllNetworks(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    advancefilter?: NetworksFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.networkService
        .getAllNetworks(search, this.pageIndex, this.pageSize, sortField, sortDirection, advancefilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Networks>) => {
          if (page) {
            this.networks = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
