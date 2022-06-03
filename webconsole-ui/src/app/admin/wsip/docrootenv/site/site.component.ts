import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../../shared/models/page.model';
import { Website } from '../../../../shared/models/website.model';
import { DocrootService } from '../../../../shared/services/docroot.service';
import { AddSiteDialogComponent } from './add-site/add-site-dialog.component';

@Component({
  selector: 'stgo-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit, OnDestroy {
  @Input()
  env: string;
  @Input()
  docroot: string;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  ELEMENT_DATA: Website[] = [];
  datasource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['code', 'websiteName', 'versions', 'actions'];
  totalElements: number;
  deleting = false;
  websiteCode: string;
  isLoading = false;
  sites: Website[];

  private initSubscription: ISubscription;
  private siteSubscription: ISubscription;

  constructor(private docrootService: DocrootService, private cdRef: ChangeDetectorRef, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.paginator.pageSize = 10;
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.getSites();
  }

  ngOnDestroy(): void {
    this.initSubscription.unsubscribe();
    if (this.siteSubscription) {
      this.siteSubscription.unsubscribe();
    }
  }

  getSites(): void {
    this.isLoading = true;
    this.initSubscription = this.docrootService
      .getAllSites(this.paginator.pageIndex, this.paginator.pageSize, this.docroot, this.env)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Website>) => {
        this.sites = page.content;
        this.totalElements = page.totalElements;
        this.datasource = new MatTableDataSource();
        this.datasource.data = page.content;
        this.datasource.sort = this.sort;
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddSiteDialogComponent, {
      width: '80%',
      height: '40%',
      data: { environmentCode: this.env, docrootCode: this.docroot }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getSites();
        this.cdRef.detectChanges();
      }
    });
  }

  deleteSite(websiteCode: string): void {
    this.deleting = true;
    this.websiteCode = websiteCode;

    this.siteSubscription = this.docrootService
      .deleteDocrootSite(this.env, this.docroot, websiteCode)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.datasource.data = this.datasource.data.filter((s) => s.code !== websiteCode);
        this.cdRef.detectChanges();
      });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
}
