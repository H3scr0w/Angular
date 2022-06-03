import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { DelegationService, Page } from '@shared';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DelegationHome } from '../../shared/models/delegation-home';

@Component({
  selector: 'stgo-delegation-home',
  templateUrl: './delegation-home.component.html',
  styleUrls: ['./delegation-home.component.css']
})
export class DelegationHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  delegations: DelegationHome[] = [];
  isLoading = false;
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = ['delegationName', 'sitesCount'];
  @Input() siteCount: number;
  total: number;
  init = true;

  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  private initSubscription: Subscription;
  private sub$: Subscription = new Subscription();

  constructor(private delegationService: DelegationService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.getDelegationsSiteCount(this.sort.active, this.sort.direction, this.searchValue);
    });

    this.sub$.add(this.filter$);
    this.sub$.add(this.initSubscription);
  }

  ngAfterViewInit() {
    this.getDelegationsSiteCount('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getDelegationsSiteCount(this.sort.active, this.sort.direction, this.searchValue);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getDelegationsSiteCount(this.sort.active, this.sort.direction, this.searchValue);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  getDelegationsSiteCount(sortField?: string, sortDirection?: SortDirection, search?: string) {
    this.isLoading = true;
    this.initSubscription = this.delegationService
      .getAllDelegationsSiteCount(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<DelegationHome>) => {
        if (page) {
          this.delegations = page.content;
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
