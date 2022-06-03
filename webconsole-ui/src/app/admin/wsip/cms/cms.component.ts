import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Cms } from '../../../shared/models/cms.model';
import { Page } from '../../../shared/models/page.model';
import { CmsService } from '../../../shared/services/cms.service';
import { EditCmsDialogComponent } from './edit-cms/edit-cms-dialog.component';

@Component({
  selector: 'stgo-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})
export class CmsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  cmsList: Cms[] = [];
  displayedColumns: string[] = ['code', 'name', 'codeRepositoryUrl', 'binaryRepositoryUrl', 'actions'];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  searchValue: string;
  private sub$ = new Subscription();

  constructor(public dialog: MatDialog, private cmsService: CmsService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllCms('code', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllCms(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllCms(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  openDialog(cms?: Cms): void {
    const dialogRef = this.dialog.open(EditCmsDialogComponent, {
      width: '80%',
      height: '60%',
      data: { cms }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllCms();
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
    this.getAllCms(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getAllCms(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.cmsService
      .getAllCms(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Cms>) => {
        this.totalElements = page.totalElements;
        this.cmsList = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
