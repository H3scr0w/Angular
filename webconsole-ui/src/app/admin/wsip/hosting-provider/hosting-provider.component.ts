import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HostingProvider } from '../../../shared/models/hosting-provider.model';
import { Page } from '../../../shared/models/page.model';
import { HostingProviderService } from '../../../shared/services/hosting-provider.service';
import { EditHostingProviderDialogComponent } from './edit-hosting-provider-dialog/edit-hosting-provider-dialog.component';

@Component({
  selector: 'stgo-hosting-provider',
  templateUrl: './hosting-provider.component.html',
  styleUrls: ['./hosting-provider.component.css']
})
export class HostingProviderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  hostingProviders: HostingProvider[] = [];
  displayedColumns: string[] = ['code', 'name', 'actions'];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  searchValue: string;
  private sub$ = new Subscription();

  constructor(
    public dialog: MatDialog,
    private hostingProviderService: HostingProviderService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getHostingProviders('code', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getHostingProviders(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getHostingProviders(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  openDialog(hostingProvider?: HostingProvider): void {
    const dialogRef = this.dialog.open(EditHostingProviderDialogComponent, {
      width: '80%',
      height: '50%',
      data: { hostingProvider }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getHostingProviders(this.sort.active, this.sort.direction, this.searchValue);
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
    this.getHostingProviders(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getHostingProviders(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.hostingProviderService
      .getAllHostingProviders(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<HostingProvider>) => {
        this.totalElements = page.totalElements;
        this.hostingProviders = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
