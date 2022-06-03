import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../shared/models/domain.model';
import { Page } from '../../../../shared/models/page.model';
import { DocrootService } from '../../../../shared/services/docroot.service';
import { DialogDocrootenvDomainComponent } from './dialog-docrootenv-domain/dialog-docrootenv-domain.component';

@Component({
  selector: 'stgo-docrootenv-domain',
  templateUrl: './docrootenv-domain.component.html',
  styleUrls: ['./docrootenv-domain.component.css']
})
export class DocrootenvDomainComponent implements OnInit, OnDestroy {
  @Input()
  env: string;
  @Input()
  docroot: string;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  ELEMENT_DATA: Domain[] = [];
  datasource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['code', 'name', 'actions'];
  totalElements: number;
  deleting = false;
  isLoading = false;
  domainCode: string;

  private initSubscription: ISubscription;
  private domainSubscription: ISubscription;

  constructor(private docrootService: DocrootService, private cdRef: ChangeDetectorRef, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.paginator.pageSize = 10;
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.getDomains();
  }

  ngOnDestroy(): void {
    this.initSubscription.unsubscribe();
    if (this.domainSubscription) {
      this.domainSubscription.unsubscribe();
    }
  }

  getDomains(): void {
    this.isLoading = true;
    this.initSubscription = this.docrootService
      .getAllDomains(this.paginator.pageIndex, this.paginator.pageSize, this.docroot, this.env)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Domain>) => {
        this.totalElements = page.totalElements;
        this.datasource = new MatTableDataSource();
        this.datasource.data = page.content;
        this.datasource.sort = this.sort;
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogDocrootenvDomainComponent, {
      width: '80%',
      height: '40%',
      data: { environmentCode: this.env, docrootCode: this.docroot }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDomains();
        this.cdRef.detectChanges();
      }
    });
  }

  deleteDomain(domainCode: string): void {
    this.deleting = true;
    this.domainCode = domainCode;

    this.domainSubscription = this.docrootService
      .deleteDocrootDomain(this.env, this.docroot, domainCode)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.datasource.data = this.datasource.data.filter((domain) => domain.code !== domainCode);
        this.cdRef.detectChanges();
      });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
}
