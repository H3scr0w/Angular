import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../shared/models/domain.model';
import { Page } from '../../../shared/models/page.model';
import { DomainService } from '../../../shared/services/domain.service';
import { EditDomainDialogComponent } from './edit-domain-dialog/edit-domain-dialog.component';

@Component({
  selector: 'stgo-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit, OnDestroy {
  ELEMENT_DATA: Domain[] = [];
  datasource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = [
    'code',
    'name',
    'registarCode',
    'wafId',
    'realm',
    'user',
    'password',
    'useDocrootEnvAuth',
    'isBasicAuth',
    'httpsEnable',
    'isQualysEnable',
    'actions'
  ];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  isLoading = false;
  hide = true;
  private initSubscription: ISubscription;

  constructor(public dialog: MatDialog, private domainService: DomainService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.paginator.pageSize = 10;
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.getAllDomain();
  }

  ngOnDestroy(): void {
    this.initSubscription.unsubscribe();
  }

  getAllDomain(): void {
    this.isLoading = true;
    this.initSubscription = this.domainService
      .getAllDomains(this.paginator.pageIndex, this.paginator.pageSize)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Domain>) => {
        this.totalElements = page.totalElements;
        this.cdRef.detectChanges();
        this.datasource = new MatTableDataSource();
        this.datasource.data = page.content;
        this.datasource.sort = this.sort;
      });
  }

  openDialog(domain?: Domain): void {
    const dialogRef = this.dialog.open(EditDomainDialogComponent, {
      width: '80%',
      height: '80%',
      data: { domain }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllDomain();
      }
    });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
}
