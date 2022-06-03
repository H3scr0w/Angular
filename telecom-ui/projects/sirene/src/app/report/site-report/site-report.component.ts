import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { saveAs } from 'file-saver';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Subscription } from 'rxjs/internal/Subscription';
import { Page, SiteFilter, SiteService } from '../../shared';
import { ReportSite } from '../../shared/models/report-site';

@Component({
  selector: 'stgo-site-report',
  templateUrl: './site-report.component.html',
  styleUrls: ['./site-report.component.scss']
})
export class SiteReportComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  sites: ReportSite[] = [];
  isLoading = false;
  totalElements: number;
  searchValue: string;
  displayedColumns: string[] = ['siteCode', 'orderId', 'deploymentStatus', 'deviceStatus', 'billStatus'];
  pageIndex = 0;
  pageSize = 300;
  panelFilterOpenState = true;
  filterCount = 0;
  advanceFilter: SiteFilter;
  siteAdvanceFilterForm = this.fb.group({
    showErrors: false,
    showObsolete: false
  });
  private initSubscription: Subscription;
  private reportSiteExcelSubscription: Subscription;
  private sub$: Subscription = new Subscription();

  constructor(private siteService: SiteService, private cdRef: ChangeDetectorRef, private fb: FormBuilder) {}

  ngOnInit() {
    this.sub$.add(this.initSubscription);
    this.sub$.add(this.reportSiteExcelSubscription);
  }

  ngAfterViewInit() {
    this.getAllReportSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllReportSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllReportSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  toggleFilterPanel() {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  countAdvanceFilter(filter: SiteFilter): void {
    this.filterCount = 0;
    if (filter && filter.showErrors) {
      this.filterCount++;
    }
    if (filter && filter.showObsolete) {
      this.filterCount++;
    }
  }

  resetAdvanceFilter(): void {
    this.siteAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllReportSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  applyAdvanceFilter(): void {
    this.advanceFilter = Object.assign(this.siteAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllReportSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  exportExcel(): void {
    this.isLoading = true;
    this.reportSiteExcelSubscription = this.siteService
      .exportExcelReportSite(
        this.pageIndex,
        this.pageSize,
        this.sort.active,
        this.sort.direction,
        this.searchValue,
        this.advanceFilter
      )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((excelContent: Blob) => {
        if (excelContent) {
          const blob = new Blob([excelContent], { type: 'application/octet-stream' });
          saveAs(blob, 'ReportSites.xlsx');
        }
      });
  }

  isSiteObsolete(reportSite: ReportSite): boolean {
    return (
      !reportSite.siteArchiveDate &&
      (!reportSite.orderId || (reportSite.endOfBilling && reportSite.deviceStatus === 'ARCHIVE'))
    );
  }

  isSiteOnError(reportSite: ReportSite): boolean {
    return (
      this.isInvoicedButArchiveDevices(reportSite) ||
      this.isInvoicedButDeploymentNotAccepted(reportSite) ||
      this.isTerminationButNotInvoiced(reportSite) ||
      this.isArchivedSiteButInvoiced(reportSite) ||
      this.isArchivedSiteButActiveDevices(reportSite)
    );
  }

  private getAllReportSites(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): void {
    this.isLoading = true;
    this.initSubscription = this.siteService
      .getAllReportSites(this.pageIndex, this.pageSize, sortField, sortDirection, search, siteFilter)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<ReportSite>) => {
        if (page) {
          this.sites = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }
      });
  }

  private isInvoicedButArchiveDevices(reportSite: ReportSite): boolean {
    // 1 - Order creation or change (TOM2) & Device status "Archive" (SPO) & Invoiced (Tempo) = billed but
    // no equipments
    return (
      (reportSite.action === 'Creation' || reportSite.action === 'Change' || reportSite.action === 'Admin') &&
      reportSite.deviceStatus === 'ARCHIVE' &&
      reportSite.startOfBilling &&
      !reportSite.endOfBilling
    );
  }

  private isInvoicedButDeploymentNotAccepted(reportSite: ReportSite): boolean {
    // 2 - Not "Fully Accepted" (DO) & Invoiced (Tempo) = billed but deployment not accepted
    return reportSite.deploymentStatus !== 'Fully Accepted' && reportSite.startOfBilling && !reportSite.endOfBilling;
  }

  private isTerminationButNotInvoiced(reportSite: ReportSite): boolean {
    // 3 - Terminated but not invoiced
    return reportSite.action === 'Termination' && (!reportSite.startOfBilling || !reportSite.endOfBilling);
  }

  private isArchivedSiteButInvoiced(reportSite: ReportSite): boolean {
    // 4 - Site archived but invoiced
    return reportSite.siteArchiveDate && reportSite.startOfBilling && !reportSite.endOfBilling;
  }

  private isArchivedSiteButActiveDevices(reportSite: ReportSite): boolean {
    // 5 - Site archived with active devices
    return reportSite.siteArchiveDate && reportSite.deviceStatus !== 'ARCHIVE';
  }
}
