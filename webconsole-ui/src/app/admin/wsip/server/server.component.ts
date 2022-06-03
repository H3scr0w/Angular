import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../shared/models/page.model';
import { Server } from '../../../shared/models/server.model';
import { ServerService } from '../../../shared/services/server.service';
import { EditServerDialogComponent } from './edit-server/edit-server-dialog.component';

@Component({
  selector: 'stgo-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  servers: Server[] = [];
  displayedColumns: string[] = [
    'hostname',
    'domain',
    'created',
    'lastUpdate',
    'enable',
    'login',
    'sshServer',
    'actions'
  ];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  hide = true;
  searchValue: string;
  private sub$ = new Subscription();

  constructor(public dialog: MatDialog, private serverService: ServerService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllServers('hostname', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllServers(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllServers(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  openDialog(server?: Server): void {
    const dialogRef = this.dialog.open(EditServerDialogComponent, {
      width: '80%',
      height: '70%',
      data: { server }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllServers(this.sort.active, this.sort.direction, this.searchValue);
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
    this.getAllServers(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getAllServers(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.serverService
      .getAllServers(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Server>) => {
        this.totalElements = page.totalElements;
        this.servers = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
