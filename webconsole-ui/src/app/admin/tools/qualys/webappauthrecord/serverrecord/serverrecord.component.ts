import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ListWrapper } from '../../../../../shared/models/tools/qualys/util/list-wrapper.model';
import { SetWrapper } from '../../../../../shared/models/tools/qualys/util/set-wrapper.model';
import { WebAppAuthServerRecordField } from '../../../../../shared/models/tools/qualys/webappauth-serverrecord-field.model';
import { WebAppAuthRecord } from '../../../../../shared/models/tools/qualys/webappauthrecord.model';
import { WebappauthrecordService } from '../../../../../shared/services/tools/qualys/webappauthrecord.service';
import { AddServerRecordDialogComponent } from './add-serverrecord-dialog/add-serverrecord-dialog.component';

@Component({
  selector: 'stgo-serverrecord',
  templateUrl: './serverrecord.component.html',
  styleUrls: ['./serverrecord.component.css']
})
export class ServerRecordComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  webAppAuthRecord: WebAppAuthRecord;
  webAppAuthRecordId: number;

  dataSource = new MatTableDataSource<WebAppAuthServerRecordField>();
  isLoading = false;
  deleting = false;
  serverRecordDomain: string;
  displayedColumns: string[] = ['type', 'domain', 'username', 'password', 'actions'];
  hide = true;

  private initSubscription: Subscription;
  private webappauthrecordSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private webappauthrecordService: WebappauthrecordService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.webAppAuthRecordId = +params.get('webAppAuthRecordId')!;
      this.getWebAppAuthRecord(this.webAppAuthRecordId);
    });
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }

    if (this.webappauthrecordSubscription) {
      this.webappauthrecordSubscription.unsubscribe();
    }
  }

  getWebAppAuthRecord(webAppAuthRecordId: number): void {
    this.isLoading = true;
    this.initSubscription = this.webappauthrecordService
      .getWebAppAuthRecord(this.webAppAuthRecordId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((webAppAuthRecord: WebAppAuthRecord) => {
        this.webAppAuthRecord = webAppAuthRecord;
        this.dataSource = new MatTableDataSource();

        const serverRecords: WebAppAuthServerRecordField[] = webAppAuthRecord.serverRecord.fields.list.map(
          (wrapper: ListWrapper<WebAppAuthServerRecordField>) => {
            return wrapper.WebAppAuthServerRecordField;
          }
        );

        this.dataSource.data = serverRecords;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  add(): void {
    const dialogRef = this.dialog.open(AddServerRecordDialogComponent, {
      width: '80%',
      data: { webAppAuthRecord: this.webAppAuthRecord }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getWebAppAuthRecord(this.webAppAuthRecordId);
      }
    });
  }

  delete(serverRecord: WebAppAuthServerRecordField): void {
    this.deleting = true;
    this.serverRecordDomain = serverRecord.domain;

    this.webAppAuthRecord.serverRecord.fields.list = this.webAppAuthRecord.serverRecord.fields.list.filter(
      (wrapper: ListWrapper<WebAppAuthServerRecordField>) => {
        return wrapper.WebAppAuthServerRecordField.domain !== this.serverRecordDomain;
      }
    );

    const serverRecords: WebAppAuthServerRecordField[] = this.webAppAuthRecord.serverRecord.fields.list.map(
      (wrapper: ListWrapper<WebAppAuthServerRecordField>) => {
        wrapper.WebAppAuthServerRecordField.id = null!;
        return wrapper.WebAppAuthServerRecordField;
      }
    );

    this.webAppAuthRecord.serverRecord.fields.set = new SetWrapper<WebAppAuthServerRecordField>();
    this.webAppAuthRecord.serverRecord.fields.set.WebAppAuthServerRecordField = [];

    this.webAppAuthRecord.serverRecord.fields.set.WebAppAuthServerRecordField = serverRecords.filter(
      (record) => record.domain !== this.serverRecordDomain
    );

    if (this.webAppAuthRecord.serverRecord.fields.set.WebAppAuthServerRecordField.length === 0) {
      this.snackBar.open('A WebAppAuthRecord must have at least ONE authentication', '', {
        duration: 4000,
        panelClass: 'error',
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
      this.deleting = false;
      return;
    }

    this.webappauthrecordSubscription = this.webappauthrecordService
      .updateWebAppAuthRecord(this.webAppAuthRecord.id, this.webAppAuthRecord)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.getWebAppAuthRecord(this.webAppAuthRecordId);
        this.cdRef.detectChanges();
      });
  }
}
