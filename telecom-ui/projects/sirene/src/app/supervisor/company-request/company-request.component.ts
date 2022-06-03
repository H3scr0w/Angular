import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, Page } from '@shared';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RequestCompanyDialogComponent } from '../../request/request-company-dialog/request-company-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CompanyRequest } from '../../shared/models/company-request';
import { RequestActionStatus, RequestActionType } from '../../shared/models/dropdown-type';
import { SupervisorRequestFilter } from '../../shared/models/supervisor-request';
import { CompanyRequestService } from '../../shared/services/company-request/company-request.service';

@Component({
  selector: 'stgo-company-request',
  templateUrl: './company-request.component.html',
  styleUrls: ['./company-request.component.scss']
})
export class CompanyRequestComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  companyRequests: CompanyRequest[] = [];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = ['companyName', 'requestType', 'applicant', 'requestDate', 'actions'];
  isAdmin: boolean;
  isViewOnly: boolean;
  private sub$: Subscription = new Subscription();
  @Input() companySupervisorAdvanceFilter: SupervisorRequestFilter;
  requestActionType: RequestActionType;

  constructor(
    private authenticationService: AuthenticationService,
    private companyRequestService: CompanyRequestService,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isViewOnly = false;
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllCompanyRequests(this.sort.active, this.sort.direction, this.companySupervisorAdvanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllCompanyRequests(this.sort.active, this.sort.direction, this.companySupervisorAdvanceFilter);
      });
    }
  }

  ngOnChanges() {
    if (this.companySupervisorAdvanceFilter && this.sort) {
      if (this.companySupervisorAdvanceFilter.status !== RequestActionStatus.Incoming) {
        this.isViewOnly = true;
      } else {
        this.isViewOnly = false;
      }
      this.sort.active = this.sort.active === undefined ? 'requestDate' : this.sort.active;
      this.sort.direction = this.sort.direction === undefined ? 'desc' : this.sort.direction;
      this.getAllCompanyRequests(this.sort.active, 'desc', this.companySupervisorAdvanceFilter);
    }
  }

  openRequest(data: CompanyRequest) {
    const dialogRef = this.dialog.open(RequestCompanyDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { sifCode: '', id: data.id, action: data.requestType, mode: 'validate', viewOnly: this.isViewOnly }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllCompanyRequests(this.sort.active, 'desc', this.companySupervisorAdvanceFilter);
      }
    });
  }

  cancel(data: CompanyRequest): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '350px',
        disableClose: true,
        data: this.translateService.instant('common.cancel.request.confirmation.message')
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.isLoading = true;
          data.status = RequestActionStatus.Cancelled;
          this.sub$.add(
            this.companyRequestService
              .cancelCompanyRequest(data)
              .pipe(finalize(() => (this.isLoading = false)))
              .subscribe(res => {
                if (res) {
                  this.messageService.show(this.translateService.instant('common.cancel.success.message'), 'success');
                  this.getAllCompanyRequests(
                    this.sort.active,
                    this.sort.direction,
                    this.companySupervisorAdvanceFilter
                  );
                }
              })
          );
        }
      });
  }

  private getAllCompanyRequests(
    sortField?: string,
    sortDirection?: SortDirection,
    requestFilter?: SupervisorRequestFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.companyRequestService
        .getAllCompanyRequests(this.pageIndex, this.pageSize, sortField, sortDirection, null, requestFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<CompanyRequest>) => {
          if (page) {
            this.companyRequests = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
