import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadBalancer } from '../../../../shared/models/loadbalancer.model';
import { Page } from '../../../../shared/models/page.model';
import { DocrootService } from '../../../../shared/services/docroot.service';
import { DialogDocrootenvLoadbalancerComponent } from './dialog-docrootenv-loadbalancer/dialog-docrootenv-loadbalancer.component';

@Component({
  selector: 'stgo-docrootenv-loadbalancer',
  templateUrl: './docrootenv-loadbalancer.component.html',
  styleUrls: ['./docrootenv-loadbalancer.component.css']
})
export class DocrootenvLoadbalancerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  env: string;
  @Input()
  docroot: string;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  loadbalancers: LoadBalancer[] = [];
  displayedColumns: string[] = ['code', 'name', 'actions'];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  deleting = false;
  loadBalancerCode: string;

  searchValue: string;
  private sub$ = new Subscription();

  constructor(
    private docrootService: DocrootService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getLoadBalancers('code', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getLoadBalancers(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getLoadBalancers(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogDocrootenvLoadbalancerComponent, {
      width: '80%',
      height: '40%',
      data: { environmentCode: this.env, docrootCode: this.docroot }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getLoadBalancers(this.sort.active, this.sort.direction, this.searchValue);
      }
    });
  }

  deleteLoadBalancer(loadBalancerCode: string): void {
    this.deleting = true;
    this.loadBalancerCode = loadBalancerCode;

    this.sub$.add(this.docrootService
      .deleteDocrootLoadBalancer(this.env, this.docroot, loadBalancerCode)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.getLoadBalancers(this.sort.active, this.sort.direction, this.searchValue);
      }));
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = '';
    }
    this.getLoadBalancers(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getLoadBalancers(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.docrootService
      .getAllLoadBalancers(
        this.pageIndex,
        this.pageSize, this.docroot,
        this.env, sortField,
        sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<LoadBalancer>) => {
        this.totalElements = page.totalElements;
        this.loadbalancers = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
