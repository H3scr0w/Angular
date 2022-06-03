import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { AuthenticationService } from '../../../core';
import { IspCarrier } from '../../../shared/models/isp-carrier';
import { Page } from '../../../shared/models/page.model';
import { IspCarrierService } from '../../../shared/service/isp-carrier/isp-carrier.service';
import { IspCarrierDialogComponent } from '../isp-carrier-dialog/isp-carrier-dialog.component';

@Component({
  selector: 'stgo-isp-carrier-list',
  templateUrl: './isp-carrier-list.component.html',
  styleUrls: ['./isp-carrier-list.component.css']
})
export class IspCarrierListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  ispCarriers: IspCarrier[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = ['ispCarrier', 'ispHelpdeskContact', 'actions'];
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;
  panelFilterOpenState = false;
  advanceFilter: IspCarrier;

  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();

  ispCarrierAdvanceFilterForm = this.fb.group({
    ispCarrier: ['', [Validators.required, Validators.minLength(1)]],
    ispHelpdeskContact: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private ispCarrierService: IspCarrierService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isPmUser = this.authenticationService.credentials.isPmUser;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;

    this.sub$.add(
      this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchValue => {
        this.searchValue = searchValue;
        this.resetAdvanceFilter();
      })
    );
  }

  ngAfterViewInit(): void {
    this.getAllIspCarriers('ispCarrier', 'asc');

    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllIspCarriers(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllIspCarriers(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }
  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  addIspCarrier(): void {
    const dialogRef = this.dialog.open(IspCarrierDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'add', ispCarrier: new IspCarrier() }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllIspCarriers(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editIspCarrier(data: IspCarrier): void {
    const dialogRef = this.dialog.open(IspCarrierDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'edit', ispCarrier: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllIspCarriers(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
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
    this.advanceFilter = Object.assign({}, this.ispCarrierAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllIspCarriers(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.ispCarrierAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.pageIndex = 0;
    this.getAllIspCarriers(this.sort.active, this.sort.direction, this.searchValue);
  }

  private countAdvanceFilter(ispCarrierFilter: IspCarrier): void {
    this.filterCount = 0;
    if (ispCarrierFilter) {
      if (ispCarrierFilter.ispCarrier) {
        this.filterCount++;
      }
      if (ispCarrierFilter.ispHelpdeskContact) {
        this.filterCount++;
      }
    }
  }

  private getAllIspCarriers(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    ispCarrierFilter?: IspCarrier
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.ispCarrierService
        .getAllIspCarriers(this.pageIndex, this.pageSize, sortField, sortDirection, search, ispCarrierFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<IspCarrier>) => {
          if (page) {
            this.ispCarriers = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
