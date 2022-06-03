import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../../shared/models/page.model';
import { Report } from '../../../../shared/models/tools/qualys/report.model';
import { ReportService } from '../../../../shared/services/tools/qualys/report.service';
import { CreateReportDialogComponent } from './create-report-dialog/create-report-dialog.component';

@Component({
  selector: 'stgo-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy {
  ELEMENT_DATA: Report[] = [];
  datasource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['name', 'status', 'size', 'creationDate', 'lastDownloadDate', 'actions'];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  isLoading = false;
  deleting = false;
  downloading = false;
  reportName: string;

  private initSubscription: Subscription;
  private downloadReportSubscription: Subscription;
  private deleteReportSubscription: Subscription;

  constructor(public dialog: MatDialog, private reportService: ReportService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.paginator.pageSize = 10;
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.getAllReports();
  }

  ngOnDestroy(): void {
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }

    if (this.downloadReportSubscription) {
      this.downloadReportSubscription.unsubscribe();
    }

    if (this.deleteReportSubscription) {
      this.deleteReportSubscription.unsubscribe();
    }
  }

  getAllReports(): void {
    this.isLoading = true;
    this.initSubscription = this.reportService
      .getReports(this.paginator.pageIndex, this.paginator.pageSize)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Report>) => {
        this.totalElements = page.totalElements;
        this.cdRef.detectChanges();
        this.datasource = new MatTableDataSource();
        this.datasource.data = page.content;
        this.datasource.sort = this.sort;
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateReportDialogComponent, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllReports();
      }
    });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  download(scanReport: Report): void {
    this.downloading = true;
    this.reportName = scanReport.name;
    this.downloadReportSubscription = this.reportService
      .downloadReport(scanReport.id)
      .pipe(finalize(() => (this.downloading = false)))
      .subscribe((reportFile: Blob) => {
        saveAs(reportFile, 'Report_' + scanReport.id + '_' + Date.now() + '.pdf');
      });
  }

  delete(scanReport: Report): void {
    this.deleting = true;
    this.reportName = scanReport.name;
    this.deleteReportSubscription = this.reportService
      .deleteReport(scanReport.id)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.datasource.data = this.datasource.data.filter((report) => report.name !== this.reportName);
        this.cdRef.detectChanges();
      });
  }
}
