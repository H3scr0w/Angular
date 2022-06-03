import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Environment } from '../../../shared/models/environment.model';
import { Page } from '../../../shared/models/page.model';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { EditEnvironmentDialogComponent } from './edit-environment/edit-environment-dialog.component';

@Component({
  selector: 'stgo-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css']
})
export class EnvironmentComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  environments: Environment[] = [];
  displayedColumns: string[] = ['code', 'name', 'actions'];
  totalElements: number;
  isLoading = false;
  pageIndex = 0;
  pageSize = 10;
  searchValue: string;
  private sub$ = new Subscription();

  constructor(
    public dialog: MatDialog,
    private environmentService: EnvironmentService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllEnvironments('code', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllEnvironments(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllEnvironments(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$){
      this.sub$.unsubscribe();
    }
  }

  openDialog(environment?: Environment): void {
    const dialogRef = this.dialog.open(EditEnvironmentDialogComponent, {
      width: '80%',
      height: '50%',
      data: { environment }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllEnvironments(this.sort.active, this.sort.direction, this.searchValue);
      }
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
    this.getAllEnvironments(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getAllEnvironments(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.environmentService
      .getAllEnvironments(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Environment>) => {
        this.totalElements = page.totalElements;
        this.environments = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
