import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MailingList, MailingListService, Page } from '@shared';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { MailingListDialogComponent } from '../mailing-list-dialog/mailing-list-dialog.component';

@Component({
  selector: 'stgo-mailing-list',
  templateUrl: './mailing-list.component.html',
  styleUrls: ['./mailing-list.component.scss']
})
export class MailingListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  mailingList: MailingList;
  dataSource: MatTableDataSource<MailingList>;
  isLoading = false;
  totalElements: number;
  searchValue: string;
  displayedColumns: string[] = ['mailingList', 'actions'];
  pageIndex = 0;
  pageSize = 10;

  private filter = new Subject<string>();
  private filter$: Subscription;
  private sortSubscription: Subscription;
  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private mailingListService: MailingListService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.filter$ = this.filter.pipe(debounceTime(200), distinctUntilChanged()).subscribe((searchValue: string) => {
      this.pageIndex = 0;
      this.searchValue = searchValue;
      this.getMailingLists(this.sort.active, this.sort.direction, searchValue);
    });

    this.sub$.add(this.filter$);
    this.sub$.add(this.sortSubscription);
  }

  ngAfterViewInit() {
    this.getMailingLists('mailingList', 'asc');
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getMailingLists(this.sort.active, this.sort.direction, this.searchValue);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getMailingLists(this.sort.active, this.sort.direction, this.searchValue);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  getMailingLists(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sortSubscription = this.mailingListService
      .getAllMailingList(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<MailingList>) => {
        if (page) {
          this.dataSource = new MatTableDataSource(page.content);
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }
      });
  }

  edit(data: MailingList) {
    const dialogRef = this.dialog.open(MailingListDialogComponent, {
      width: '450px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      data.mailingList = result;
    });
  }
}
