import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { Delegation, DelegationFilter, DelegationService, MessageService, Page } from '@shared';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DelegationDialogComponent } from '../delegation-dialog/delegation-dialog.component';

@Component({
  selector: 'stgo-delegation-list',
  templateUrl: './delegation-list.component.html',
  styleUrls: ['./delegation-list.component.css']
})
export class DelegationListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  delegations: Delegation[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  panelFilterOpenState = true;
  advanceFilter: DelegationFilter;
  displayedColumns: string[] = ['id', 'name', 'actions'];

  delegationAdvanceFilterForm = this.fb.group({
    id: [''],
    name: [''],
    showArchived: ['']
  });

  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  private delegationSubscription: Subscription;
  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private delegationService: DelegationService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.pageIndex = 0;
      this.resetAdvanceFilter();
    });

    this.sub$.add(this.filter$);
    this.sub$.add(this.delegationSubscription);
  }

  ngAfterViewInit() {
    this.getAllDelegations('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllDelegations(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllDelegations(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  applyFilter(filterValue: string): void {
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = null;
    }
    this.filter.next(this.searchValue);
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  addDelegation(): void {
    const dialogRef = this.dialog.open(DelegationDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { delegation: new Delegation(), mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllDelegations(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editDelegation(data: Delegation): void {
    const dialogRef = this.dialog.open(DelegationDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { delegation: data, mode: 'edit' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllDelegations(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  deleteDelegation(data: Delegation): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.delete.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.delegationSubscription = this.delegationService
          .deleteDelegation(data.id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            if (res) {
              this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
              this.getAllDelegations(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
            }
          });
      }
    });
  }

  recoverDelegation(data: Delegation): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.recover.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.delegationSubscription = this.delegationService
          .recoverDelegation(data)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            if (res) {
              this.messageService.show(this.translateService.instant('common.recover.success.message'), 'success');
              this.getAllDelegations(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
            }
          });
      }
    });
  }

  applyAdvanceFilter(): void {
    this.pageIndex = 0;
    this.searchValue = null;
    this.advanceFilter = Object.assign(this.delegationAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllDelegations(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.delegationAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.getAllDelegations(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  private countAdvanceFilter(filter: DelegationFilter): void {
    this.filterCount = 0;
    if (filter) {
      if (filter.id) {
        this.filterCount++;
      }
      if (filter.name) {
        this.filterCount++;
      }
      if (filter.showArchived) {
        this.filterCount++;
      }
    }
  }

  private getAllDelegations(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    delegationFilter?: DelegationFilter
  ): void {
    this.isLoading = true;
    this.delegationSubscription = this.delegationService
      .getAllDelegations(search, delegationFilter, this.pageIndex, this.pageSize, sortField, sortDirection)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Delegation>) => {
        if (page) {
          this.delegations = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }
      });
  }
}
