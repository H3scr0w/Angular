import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Docroot } from '../../../shared/models/docroot.model';
import { Page } from '../../../shared/models/page.model';
import { DocrootService } from '../../../shared/services/docroot.service';
import { EditDocrootDialogComponent } from './edit-docroot/edit-docroot-dialog.component';

@Component({
  selector: 'stgo-docroot',
  templateUrl: './docroot.component.html',
  styleUrls: ['./docroot.component.css']
})
export class DocrootComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  docroots: Docroot[] = [];
  displayedColumns: string[] = ['code', 'name', 'rundeckJobApiUrl', 'actions'];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  searchValue: string;
  private sub$ = new Subscription();

  constructor(
    public dialog: MatDialog,
    private docrootService: DocrootService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllDocroots('code', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllDocroots(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllDocroots(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
  openDialog(docroot?: Docroot): void {
    const dialogRef = this.dialog.open(EditDocrootDialogComponent, {
      width: '80%',
      height: '60%',
      data: { docroot }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllDocroots(this.sort.active, this.sort.direction, this.searchValue);
    });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = '';
    }
    this.getAllDocroots(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getAllDocroots(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.docrootService
      .getAllDocroots(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Docroot>) => {
        this.totalElements = page.totalElements;
        this.docroots = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
