import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppState } from '../../../core/webconsole/app.state';
import { WebsiteState } from '../../../core/webconsole/website.state';
import { DataSourceProject } from '../../../shared/models/datasource-project.model';
import { Page } from '../../../shared/models/page.model';
import { User } from '../../../shared/models/user.model';
import { Website } from '../../../shared/models/website.model';
import { ProjectService } from '../../../shared/services/project.service';

@Component({
  selector: 'stgo-wsip-project',
  templateUrl: './wsip-project.component.html',
  styleUrls: ['./wsip-project.component.css']
})
export class WsipProjectComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumnsProject: string[] = ['lastname', 'firstname', 'email', 'role', 'company'];
  website: Website;

  ELEMENT_DATA: DataSourceProject[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  isLoading = false;
  searchValue: string;
  projects: DataSourceProject[] = [];

  private dataSourceProject: Subscription;
  private initSubscription: Subscription;
  private sort$: Subscription;
  private page$: Subscription;

  constructor(
    private store: Store<AppState>,
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.paginator.pageSize = 10;

    this.dataSourceProject = this.store
      .pipe(select((state) => state && state.website))
      .subscribe((websiteState: WebsiteState) => {
        this.website = websiteState.website;
        this.getAllProjectUsers('lastname', 'asc');
      });
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sort$ = this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.getAllProjectUsers(this.sort.active, this.sort.direction, this.searchValue);
    });

    this.page$ = this.paginator.page.subscribe(() => {
      this.getAllProjectUsers(this.sort.active, this.sort.direction, this.searchValue);
    });
  }

  ngOnDestroy(): void {
    if (this.dataSourceProject) {
      this.dataSourceProject.unsubscribe();
    }
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }
    if (this.sort$) {
      this.sort$.unsubscribe();
    }
    if (this.page$) {
      this.page$.unsubscribe();
    }
  }

  getAllProjectUsers(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.initSubscription = this.projectService
      .getAllUsers(
        'w',
        this.website.code,
        this.paginator.pageIndex,
        this.paginator.pageSize,
        sortField,
        sortDirection,
        search
      )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<User>) => {
        this.projects = page.content;
        this.totalElements = page.totalElements;
        this.cdRef.detectChanges();
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
    this.getAllProjectUsers(this.sort.active, this.sort.direction, this.searchValue);
  }
}
