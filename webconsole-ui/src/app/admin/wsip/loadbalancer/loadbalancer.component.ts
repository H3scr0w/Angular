import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadBalancer } from '../../../shared/models/loadbalancer.model';
import { Page } from '../../../shared/models/page.model';
import { LoadBalancerService } from '../../../shared/services/load-balancer.service';
import { EditLoadbalancerDialogComponent } from './edit-loadbalancer-dialog/edit-loadbalancer-dialog.component';

@Component({
  selector: 'stgo-loadbalancer',
  templateUrl: './loadbalancer.component.html',
  styleUrls: ['./loadbalancer.component.css']
})
export class LoadbalancerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  loadbalancers: LoadBalancer[] = [];
  displayedColumns: string[] = ['code', 'name', 'hostingProviderCode', 'ip', 'ip2', 'fqdn', 'actions'];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  searchValue: string;
  private sub$ = new Subscription();

  constructor(
    public dialog: MatDialog,
    private loadBalancerService: LoadBalancerService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllLoadBalancer('code', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllLoadBalancer(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllLoadBalancer(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  openDialog(loadBalancer?: LoadBalancer): void {
    const dialogRef = this.dialog.open(EditLoadbalancerDialogComponent, {
      width: '80%',
      height: '70%',
      data: { loadBalancer }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllLoadBalancer(this.sort.active, this.sort.direction, this.searchValue);
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
    this.getAllLoadBalancer(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getAllLoadBalancer(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.loadBalancerService
      .getAllLoadBalancers(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<LoadBalancer>) => {
        this.totalElements = page.totalElements;
        this.loadbalancers = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
