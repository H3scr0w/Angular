import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Website } from 'src/app/shared/models/website.model';
import { Page } from '../../../shared/models/page.model';
import { WebsiteService } from '../../../shared/services/website.service';
import { AddWebsiteComponent } from './dialog/add-website/add-website.component';
import { EditWebsiteComponent } from './dialog/edit-website/edit-website.component';

@Component({
  selector: 'stgo-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  websites: Website[] = [];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  showEnable = true;
  displayedColumns: string[] = [
    'code',
    'name',
    'codeRepositoryUrl',
    'binaryRepositoryUrl',
    'homeDirectory',
    'enable',
    'isLive',
    'qualysWebAppId',
    'isQualysEnable',
    'actions'
  ];
  searchValue: string;
  private sub$ = new Subscription();

  constructor(
    private websiteService: WebsiteService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllWebsites('code', 'asc', '', this.showEnable);
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllWebsites(this.sort.active, this.sort.direction, this.searchValue, this.showEnable);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllWebsites(this.sort.active, this.sort.direction, this.searchValue, this.showEnable);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = '';
    }
    this.getAllWebsites(this.sort.active, this.sort.direction, this.searchValue, this.showEnable);
  }

  addWebsite(): void {
    const dialogRef = this.dialog.open(AddWebsiteComponent, {
      width: '80%',
      height: '80%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllWebsites(this.sort.active, this.sort.direction, this.searchValue, this.showEnable);
      }
    });
  }

  editWebsite(website: Website): void {
    const dialogRef = this.dialog.open(EditWebsiteComponent, {
      width: '80%',
      height: '80%',
      data: { website }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllWebsites(this.sort.active, this.sort.direction, this.searchValue, this.showEnable);
      }
    });
  }

  changeShowEnable(): void {
    this.getAllWebsites(this.sort.active, this.sort.direction, this.searchValue, this.showEnable);
  }

  private getAllWebsites(sortField?: string, sortDirection?: SortDirection, search?: string, showEnable?: boolean): void {
    this.isLoading = true;
    this.sub$.add(this.websiteService
      .getWebsites(this.pageIndex, this.pageSize, sortField, sortDirection, search, showEnable)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((websites: Page<Website>) => {
        this.totalElements = websites.totalElements;
        this.websites = websites.content;
        this.cdRef.detectChanges();
      })
    );
  }
}
