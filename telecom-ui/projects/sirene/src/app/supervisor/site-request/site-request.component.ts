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
import { RequestSiteCreateDialogComponent } from '../../request/request-site-create-dialog/request-site-create-dialog.component';
import { RequestSiteModifyDialogComponent } from '../../request/request-site-modify-dialog/request-site-modify-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { RequestActionStatus, RequestActionType } from '../../shared/models/dropdown-type';
import { SiteRequest } from '../../shared/models/site-request';
import { SupervisorRequestFilter } from '../../shared/models/supervisor-request';
import { SiteCreationRequestService } from '../../shared/services/site-creation-request/site-creation-request.service';
import { SiteDeletionRequestService } from '../../shared/services/site-deletion-request/site-deletion-request.service';
import { SiteModificationRequestService } from '../../shared/services/site-modification-request/site-modification-request.service';

@Component({
  selector: 'stgo-site-request',
  templateUrl: './site-request.component.html',
  styleUrls: ['./site-request.component.scss']
})
export class SiteRequestComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  siteRequests: SiteRequest[] = [];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = ['requestName', 'requestType', 'applicantName', 'requestDate', 'actions'];
  isAdmin: boolean;
  isViewOnly: boolean;
  private sub$: Subscription = new Subscription();
  @Input() siteSupervisorAdvanceFilter: SupervisorRequestFilter;

  constructor(
    private authenticationService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private siteCreationRequestService: SiteCreationRequestService,
    private siteModificationRequestService: SiteModificationRequestService,
    private siteDeletionRequestService: SiteDeletionRequestService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllSiteRequests(this.sort.active, this.sort.direction, this.siteSupervisorAdvanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllSiteRequests(this.sort.active, this.sort.direction, this.siteSupervisorAdvanceFilter);
      });
    }
  }

  ngOnChanges() {
    if (this.siteSupervisorAdvanceFilter && this.sort) {
      if (this.siteSupervisorAdvanceFilter.status !== RequestActionStatus.Incoming) {
        this.isViewOnly = true;
      } else {
        this.isViewOnly = false;
      }
      this.sort.active = this.sort.active === undefined ? 'requestDate' : this.sort.active;
      this.sort.direction =
        this.sort.direction === undefined || this.sort.direction === '' ? 'desc' : this.sort.direction;
      this.getAllSiteRequests(this.sort.active, this.sort.direction, this.siteSupervisorAdvanceFilter);
    }
  }

  openRequest(data: SiteRequest): void {
    if (this.siteSupervisorAdvanceFilter.action === RequestActionType.Creation) {
      this.creationRequest(data);
    } else if (this.siteSupervisorAdvanceFilter.action === RequestActionType.Modification) {
      this.modificationRequest(data);
    } else if (this.siteSupervisorAdvanceFilter.action === RequestActionType.Deletion) {
      this.deletionRequest(data);
    }
  }

  private deletionRequest(data: SiteRequest) {
    const dialogRef = this.dialog.open(RequestSiteModifyDialogComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: data.id,
        mode: 'validate',
        action: this.siteSupervisorAdvanceFilter.action,
        viewOnly: this.isViewOnly
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllSiteRequests(this.sort.active, 'desc', this.siteSupervisorAdvanceFilter);
      }
    });
  }

  private modificationRequest(data: SiteRequest) {
    const dialogRef = this.dialog.open(RequestSiteModifyDialogComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: data.id,
        mode: 'validate',
        action: this.siteSupervisorAdvanceFilter.action,
        viewOnly: this.isViewOnly
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllSiteRequests(this.sort.active, 'desc', this.siteSupervisorAdvanceFilter);
      }
    });
  }

  private creationRequest(data: SiteRequest) {
    const dialogRef = this.dialog.open(RequestSiteCreateDialogComponent, {
      width: '800px',
      disableClose: true,
      data: { id: data.id, mode: 'validate', viewOnly: this.isViewOnly }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== 'close') {
        this.getAllSiteRequests(this.sort.active, 'desc', this.siteSupervisorAdvanceFilter);
      }
    });
  }

  cancel(data: SiteRequest): void {
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
          if (this.siteSupervisorAdvanceFilter.action === RequestActionType.Creation) {
            this.sub$.add(
              this.siteCreationRequestService
                .cancelSiteCreationRequest(data)
                .pipe(finalize(() => (this.isLoading = false)))
                .subscribe(res => {
                  if (res) {
                    this.messageService.show(this.translateService.instant('common.cancel.success.message'), 'success');
                    this.getAllSiteRequests(this.sort.active, this.sort.direction, this.siteSupervisorAdvanceFilter);
                  }
                })
            );
          } else if (this.siteSupervisorAdvanceFilter.action === RequestActionType.Modification) {
            this.sub$.add(
              this.siteModificationRequestService
                .cancelSiteModificationRequest(data)
                .pipe(finalize(() => (this.isLoading = false)))
                .subscribe(res => {
                  if (res) {
                    this.messageService.show(this.translateService.instant('common.cancel.success.message'), 'success');
                    this.getAllSiteRequests(this.sort.active, this.sort.direction, this.siteSupervisorAdvanceFilter);
                  }
                })
            );
          } else if (this.siteSupervisorAdvanceFilter.action === RequestActionType.Deletion) {
            this.sub$.add(
              this.siteDeletionRequestService
                .cancelSiteDeletionRequest(data)
                .pipe(finalize(() => (this.isLoading = false)))
                .subscribe(res => {
                  if (res) {
                    this.messageService.show(this.translateService.instant('common.cancel.success.message'), 'success');
                    this.getAllSiteRequests(this.sort.active, this.sort.direction, this.siteSupervisorAdvanceFilter);
                  }
                })
            );
          }
        }
      });
  }

  private getAllSiteRequests(
    sortField?: string,
    sortDirection?: SortDirection,
    requestFilter?: SupervisorRequestFilter
  ): void {
    this.isLoading = true;
    if (this.siteSupervisorAdvanceFilter.action === RequestActionType.Creation) {
      this.sub$.add(
        this.siteCreationRequestService
          .getAllSiteCreationRequest(this.pageIndex, this.pageSize, sortField, sortDirection, '', requestFilter)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((page: Page<SiteRequest>) => {
            if (page) {
              this.siteRequests = page.content;
              this.totalElements = page.totalElements;
              this.cdRef.detectChanges();
            }
          })
      );
    }
    if (this.siteSupervisorAdvanceFilter.action === RequestActionType.Modification) {
      this.sub$.add(
        this.siteModificationRequestService
          .getAllSiteModificationRequest(this.pageIndex, this.pageSize, sortField, sortDirection, '', requestFilter)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((page: Page<SiteRequest>) => {
            if (page) {
              this.siteRequests = page.content;
              this.totalElements = page.totalElements;
              this.cdRef.detectChanges();
            }
          })
      );
    }
    if (this.siteSupervisorAdvanceFilter.action === RequestActionType.Deletion) {
      this.sub$.add(
        this.siteDeletionRequestService
          .getAllSiteDeletionRequest(this.pageIndex, this.pageSize, sortField, sortDirection, '', requestFilter)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((page: Page<SiteRequest>) => {
            if (page) {
              this.siteRequests = page.content;
              this.totalElements = page.totalElements;
              this.cdRef.detectChanges();
            }
          })
      );
    }
  }
}
