import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DocrootCore } from '../../../shared/models/docrootcore.model';
import { Page } from '../../../shared/models/page.model';
import { DrupalDocrootCoreService } from '../../../shared/services/drupaldocrootcore.service';
import { EditDocrootcoreDialogComponent } from './edit-docrootcore/edit-docrootcore-dialog.component';

@Component({
  selector: 'stgo-docrootcore',
  templateUrl: './docrootcore.component.html',
  styleUrls: ['./docrootcore.component.css']
})
export class DocrootcoreComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  drupals: DocrootCore[] = [];
  displayedColumns: string[] = ['code', 'name', 'codeRepositoryUrl', 'binaryRepositoryUrl', 'actions'];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  searchValue: string;
  private sub$ = new Subscription();

  constructor(
    public dialog: MatDialog,
    private drupalDocrootCoreService: DrupalDocrootCoreService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllDrupals('code', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllDrupals(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllDrupals(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  openDialog(docrootcore?: DocrootCore): void {
    const dialogRef = this.dialog.open(EditDocrootcoreDialogComponent, {
      width: '80%',
      height: '60%',
      data: { docrootcore }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllDrupals(this.sort.active, this.sort.direction, this.searchValue);
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
    this.getAllDrupals(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getAllDrupals(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.drupalDocrootCoreService
      .getAllDrupals(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<DocrootCore>) => {
        this.totalElements = page.totalElements;
        this.drupals = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
