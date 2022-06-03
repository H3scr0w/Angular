import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { CountryHome, CountryService, Page } from '@shared';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

@Component({
  selector: 'stgo-country-home',
  templateUrl: './country-home.component.html',
  styleUrls: ['./country-home.component.scss']
})
export class CountryHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  countries: CountryHome[] = [];
  isLoading = false;
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = ['name', 'sitesCount'];
  @Input() siteCount: number;
  total: number;
  init = true;

  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  private initSubscription: Subscription;
  private sub$: Subscription = new Subscription();

  constructor(private countryService: CountryService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.getCountriesSiteCount(this.sort.active, this.sort.direction, this.searchValue);
    });

    this.sub$.add(this.filter$);
    this.sub$.add(this.initSubscription);
  }

  ngAfterViewInit() {
    this.getCountriesSiteCount('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getCountriesSiteCount(this.sort.active, this.sort.direction, this.searchValue);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getCountriesSiteCount(this.sort.active, this.sort.direction, this.searchValue);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  getCountriesSiteCount(sortField?: string, sortDirection?: SortDirection, search?: string) {
    this.isLoading = true;
    this.initSubscription = this.countryService
      .getAllCountriesSiteCount(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<CountryHome>) => {
        if (page) {
          this.countries = page.content;
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
