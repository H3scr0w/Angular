import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../../shared/models/page.model';
import { Server } from '../../../../shared/models/server.model';
import { DocrootService } from '../../../../shared/services/docroot.service';
import { AddServerDialogComponent } from './add-server/add-server-dialog.component';

@Component({
  selector: 'stgo-docrootenv-server',
  templateUrl: './docrootenv-server.component.html',
  styleUrls: ['./docrootenv-server.component.css']
})
export class DocrootEnvServerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  env: string;
  @Input()
  docroot: string;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  servers: Server[] = [];
  displayedColumns: string[] = ['server', 'actions'];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  deleting = false;
  hostname: string;

  searchValue: string;
  private sub$ = new Subscription();

  constructor(private docrootService: DocrootService, private cdRef: ChangeDetectorRef, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getServers('hostname', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getServers(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getServers(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddServerDialogComponent, {
      width: '80%',
      height: '40%',
      data: { environmentCode: this.env, docrootCode: this.docroot }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getServers();
      }
    });
  }

  deleteServer(hostname: string): void {
    this.deleting = true;
    this.hostname = hostname;
    this.sub$.add(this.docrootService
      .deleteDocrootServer(this.env, this.docroot, hostname)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.getServers();
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
    this.getServers(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getServers(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.docrootService
      .getAllServers(this.pageIndex, this.pageSize, this.docroot, this.env, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Server>) => {
        this.totalElements = page.totalElements;
        this.servers = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
