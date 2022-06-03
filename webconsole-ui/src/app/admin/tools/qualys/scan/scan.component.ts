import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../../shared/models/page.model';
import { WasScanStatus } from '../../../../shared/models/tools/qualys/wascan-status.model';
import { WasScan } from '../../../../shared/models/tools/qualys/wasscan.model';
import { WasscanService } from '../../../../shared/services/tools/qualys/wasscan.service';
import { LaunchScanDialogComponent } from './launch-scan-dialog/launch-scan-dialog.component';

@Component({
  selector: 'stgo-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit, OnDestroy {
  ELEMENT_DATA: WasScan[] = [];
  datasource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['name', 'type', 'webapp', 'status', 'launchedDate', 'endScanDate', 'actions'];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  isLoading = false;
  deleting = false;
  scanName: string;
  status = {
    canceled: WasScanStatus.CANCELED,
    error: WasScanStatus.ERROR,
    finished: WasScanStatus.FINISHED,
    running: WasScanStatus.RUNNING,
    submitted: WasScanStatus.SUBMITTED
  };

  private initSubscription: Subscription;
  private cancelWasScanSubscription: Subscription;
  private deleteWasScanSubscription: Subscription;

  constructor(public dialog: MatDialog, private wasScanService: WasscanService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.paginator.pageSize = 10;
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.getAllScans();
  }

  ngOnDestroy(): void {
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }

    if (this.cancelWasScanSubscription) {
      this.cancelWasScanSubscription.unsubscribe();
    }

    if (this.deleteWasScanSubscription) {
      this.deleteWasScanSubscription.unsubscribe();
    }
  }

  getAllScans(): void {
    this.isLoading = true;
    this.initSubscription = this.wasScanService
      .getWasScans(this.paginator.pageIndex, this.paginator.pageSize)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<WasScan>) => {
        this.totalElements = page.totalElements;
        this.cdRef.detectChanges();
        this.datasource = new MatTableDataSource();
        this.datasource.data = page.content;
        this.datasource.sort = this.sort;
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LaunchScanDialogComponent, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllScans();
      }
    });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  cancel(wasScan: WasScan): void {
    this.deleting = true;
    this.scanName = wasScan.name;
    this.cancelWasScanSubscription = this.wasScanService
      .cancelWasScan(wasScan.id)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.datasource.data = this.datasource.data.map((scan) => {
          if (scan.name === this.scanName) {
            scan.status = WasScanStatus.CANCELED;
          }
          return scan;
        });
        this.cdRef.detectChanges();
      });
  }

  delete(wasScan: WasScan): void {
    this.deleting = true;
    this.scanName = wasScan.name;
    this.deleteWasScanSubscription = this.wasScanService
      .deleteWasScan(wasScan.id)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.datasource.data = this.datasource.data.filter((scan) => scan.name !== this.scanName);
        this.cdRef.detectChanges();
      });
  }
}
