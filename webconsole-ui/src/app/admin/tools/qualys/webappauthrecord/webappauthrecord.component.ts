import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../../shared/models/page.model';
import { WebAppAuthRecord } from '../../../../shared/models/tools/qualys/webappauthrecord.model';
import { WebappauthrecordService } from '../../../../shared/services/tools/qualys/webappauthrecord.service';
import { AddWebAppAuthRecordDialogComponent } from './add-webappauthrecord-dialog/add-webappauthrecord-dialog.component';

@Component({
  selector: 'stgo-webappauthrecord',
  templateUrl: './webappauthrecord.component.html',
  styleUrls: ['./webappauthrecord.component.css']
})
export class WebappauthrecordComponent implements OnInit, OnDestroy {
  ELEMENT_DATA: WebAppAuthRecord[] = [];
  datasource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['name', 'createdDate', 'updatedDate', 'actions'];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  isLoading = false;
  deleting = false;
  webAppAuthRecordName: string;

  private initSubscription: ISubscription;
  private webappauthrecordSubscription: ISubscription;

  constructor(
    public dialog: MatDialog,
    private webappauthrecordService: WebappauthrecordService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.paginator.pageSize = 10;
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.getAllWebAppAuthRecords();
  }

  ngOnDestroy(): void {
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }

    if (this.webappauthrecordSubscription) {
      this.webappauthrecordSubscription.unsubscribe();
    }
  }

  getAllWebAppAuthRecords(): void {
    this.isLoading = true;
    this.initSubscription = this.webappauthrecordService
      .getWebAppAuthRecords(this.paginator.pageIndex, this.paginator.pageSize)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<WebAppAuthRecord>) => {
        this.totalElements = page.totalElements;
        this.cdRef.detectChanges();
        this.datasource = new MatTableDataSource();
        this.datasource.data = page.content;
        this.datasource.sort = this.sort;
      });
  }

  openDialog(webAppAuthRecord?: WebAppAuthRecord): void {
    const dialogRef = this.dialog.open(AddWebAppAuthRecordDialogComponent, {
      width: '80%',
      height: '80%',
      data: { webAppAuthRecord }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllWebAppAuthRecords();
      }
    });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  delete(webAppAuthServerRecord: WebAppAuthRecord): void {
    this.deleting = true;
    this.webAppAuthRecordName = webAppAuthServerRecord.name;
    this.webappauthrecordSubscription = this.webappauthrecordService
      .deleteWebAppAuthRecord(webAppAuthServerRecord.id)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.datasource.data = this.datasource.data.filter(
          (webappauthrecord) => webappauthrecord.name !== this.webAppAuthRecordName
        );
        this.cdRef.detectChanges();
      });
  }
}
