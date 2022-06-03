import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { CompanyHome, CompanyService, Page } from '@shared';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

@Component({
  selector: 'stgo-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: ['./company-home.component.scss']
})
export class CompanyHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  companies: CompanyHome[] = [];
  isLoading = false;
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = ['companyName', 'sitesCount'];
  @Input() siteCount: number;
  total: number;
  init = true;

  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  private initSubscription: Subscription;
  private sub$: Subscription = new Subscription();

  constructor(private companyService: CompanyService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.getCompaniesSiteCount(this.sort.active, this.sort.direction, this.searchValue);
    });

    this.sub$.add(this.filter$);
    this.sub$.add(this.initSubscription);
  }

  ngAfterViewInit() {
    this.getCompaniesSiteCount('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getCompaniesSiteCount(this.sort.active, this.sort.direction, this.searchValue);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getCompaniesSiteCount(this.sort.active, this.sort.direction, this.searchValue);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  getCompaniesSiteCount(sortField?: string, sortDirection?: SortDirection, search?: string) {
    this.isLoading = true;
    this.initSubscription = this.companyService
      .getAllCompaniesSiteCount(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<CompanyHome>) => {
        if (page) {
          this.companies = page.content;
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
