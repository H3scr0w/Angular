import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { AuthenticationService } from '../../../core';
import { Operator } from '../../../shared/models/operators';
import { Page } from '../../../shared/models/page.model';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { OperatorDialogComponent } from '../operator-dialog/operator-dialog.component';

@Component({
  selector: 'stgo-operator-list',
  templateUrl: './operator-list.component.html',
  styleUrls: ['./operator-list.component.scss']
})
export class OperatorListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  operators: Operator[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = ['name', 'actions'];
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;

  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private operatorsService: OperatorsService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isPmUser = this.authenticationService.credentials.isPmUser;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;

    this.sub$.add(
      this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchValue => {
        this.pageIndex = 0;
        this.searchValue = searchValue;
        this.getAllOperators(this.sort.active, this.sort.direction, this.searchValue);
      })
    );
  }

  ngAfterViewInit() {
    this.getAllOperators('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllOperators(this.sort.active, this.sort.direction, this.searchValue);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllOperators(this.sort.active, this.sort.direction, this.searchValue);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  addOperator(): void {
    const dialogRef = this.dialog.open(OperatorDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'add', operator: new Operator() }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllOperators(this.sort.active, this.sort.direction, this.searchValue);
      }
    });
  }

  editOperator(data: Operator): void {
    const dialogRef = this.dialog.open(OperatorDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'edit', operator: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllOperators(this.sort.active, this.sort.direction, this.searchValue);
      }
    });
  }

  applyFilter(filterValue: string): void {
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = null;
    }
    this.filter.next(this.searchValue);
  }

  private getAllOperators(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.operatorsService
        .getAllOperators(this.pageIndex, this.pageSize, sortField, sortDirection, search)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Operator>) => {
          if (page) {
            this.operators = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
