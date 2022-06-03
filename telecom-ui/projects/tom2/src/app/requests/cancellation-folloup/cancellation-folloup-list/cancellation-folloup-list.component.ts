import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Observable, Subject, Subscription } from 'rxjs';

import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, filter, finalize, startWith } from 'rxjs/operators';
import { AuthenticationService } from '../../../core';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Contact } from '../../../shared/models/contact';
import { Page } from '../../../shared/models/page.model';
import { RequestCancellationDTO, RequestCancellationFilter } from '../../../shared/models/request-cancellation';
import { MessageService } from '../../../shared/service/message/message.service';
import { RequestService } from '../../../shared/service/request/request.service';
import { CancellationOrderDialogComponent } from '../cancellation-order-dialog/cancellation-order-dialog.component';

@Component({
  selector: 'stgo-cancellation-folloup-list',
  templateUrl: './cancellation-folloup-list.component.html',
  styleUrls: ['./cancellation-folloup-list.component.scss']
})
export class CancellationFolloupListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  cancellationFollowUp: RequestCancellationDTO[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = [
    'orderId',
    'status',
    'price',
    'requestDate',
    'requester',
    'orderCancellation',
    'deleteRequest'
  ];
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;
  isRequesterUser: boolean;
  panelFilterOpenState = false;
  advanceFilter: RequestCancellationFilter;
  orders: Observable<string[]>;
  requesters: Contact[];
  status: string[] = ['Done', 'Pending'];
  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();
  inputRequester: Subject<string> = new Subject<string>();

  cancellationFollowUpAdvanceFilterForm = this.fb.group({
    status: [null],
    requester: [null],
    orderId: ['']
  });

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private requestService: RequestService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isPmUser = this.authenticationService.credentials.isPmUser;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;
    this.isRequesterUser = this.authenticationService.credentials.isRequesterUser;

    this.sub$.add(
      this.inputRequester.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
        this.getAllCancelRequesters();
      })
    );
  }

  ngAfterViewInit() {
    this.getAllRequestCancellationFollowUp('requestDate', 'desc', '');

    this.sub$.add(
      this.filter
        .pipe(
          filter(value => value && value.trim().length > 1),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe(searchTextValue => {
          this.pageIndex = 0;
          this.searchValue = searchTextValue.trim();
          this.resetAdvanceFilter();
        })
    );

    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllRequestCancellationFollowUp(
          this.sort.active,
          this.sort.direction,
          this.searchValue,
          this.advanceFilter
        );
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllRequestCancellationFollowUp(
          this.sort.active,
          this.sort.direction,
          this.searchValue,
          this.advanceFilter
        );
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
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
    this.advanceFilter = Object.assign({}, this.cancellationFollowUpAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllRequestCancellationFollowUp(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.cancellationFollowUpAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.pageIndex = 0;
    this.getAllRequestCancellationFollowUp(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  orderCancellation(data: RequestCancellationDTO): void {
    const dialogRef = this.dialog.open(CancellationOrderDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'cancel-order', requestCancellation: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllRequestCancellationFollowUp(
          this.sort.active,
          this.sort.direction,
          this.searchValue,
          this.advanceFilter
        );
      }
    });
  }

  delete(cancellationFollowUp: RequestCancellationDTO): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.delete.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && cancellationFollowUp) {
        this.isLoading = true;
        this.requestService
          .deleteCancellationFollowUpRequest(cancellationFollowUp.orderId)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(() => {
            this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
            this.getAllRequestCancellationFollowUp(
              this.sort.active,
              this.sort.direction,
              this.searchValue,
              this.advanceFilter
            );
          });
      }
    });
  }

  private getAllCancelRequesters(): void {
    this.isLoading = true;
    this.sub$.add(
      this.requestService
        .getAllCancelRequesters()
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((contact: Contact[]) => {
          if (contact) {
            this.requesters = contact.sort((a, b) => a.fullName.localeCompare(b.fullName));
          }
        })
    );
  }

  private countAdvanceFilter(requestfilter: RequestCancellationFilter): void {
    this.filterCount = 0;
    if (requestfilter) {
      if (requestfilter.orderId) {
        this.filterCount++;
      }
      if (requestfilter.requester) {
        this.filterCount++;
      }
      if (requestfilter.status) {
        this.filterCount++;
      }
    }
  }

  private getAllRequestCancellationFollowUp(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    requestfilter?: RequestCancellationFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.requestService
        .getAllRequestCancellations(this.pageIndex, this.pageSize, sortField, sortDirection, search, requestfilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<RequestCancellationDTO>) => {
          if (page) {
            this.cancellationFollowUp = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
