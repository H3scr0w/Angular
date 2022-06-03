import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Page, SectorHome, SectorService } from '@shared';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

@Component({
  selector: 'stgo-sector-home',
  templateUrl: './sector-home.component.html',
  styleUrls: ['./sector-home.component.scss']
})
export class SectorHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  sectors: SectorHome[] = [];
  isLoading = false;
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = ['sectorName', 'sitesCount'];
  @Input() siteCount: number;
  total: number;
  init = true;

  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  private initSubscription: Subscription;
  private sub$: Subscription = new Subscription();

  constructor(private sectorService: SectorService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.getSectorsSiteCount(this.sort.active, this.sort.direction, this.searchValue);
    });

    this.sub$.add(this.filter$);
    this.sub$.add(this.initSubscription);
  }

  ngAfterViewInit() {
    this.getSectorsSiteCount('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getSectorsSiteCount(this.sort.active, this.sort.direction, this.searchValue);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getSectorsSiteCount(this.sort.active, this.sort.direction, this.searchValue);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  getSectorsSiteCount(sortField?: string, sortDirection?: SortDirection, search?: string) {
    this.isLoading = true;
    this.initSubscription = this.sectorService
      .getAllSectorsSiteCount(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<SectorHome>) => {
        if (page) {
          this.sectors = page.content;
          this.totalElements = page.totalElements;
          if (this.init) {
            this.total = this.totalElements;
          }
          this.cdRef.detectChanges();
        }
      });
  }

  applyFilter(filterValue: string): void {
    this.init = false;
    this.pageIndex = 0;
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = null;
    }
    this.filter.next(this.searchValue);
  }
}
