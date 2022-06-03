import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { timer, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DeploymentStatusEnum } from '../../shared/models/deployment-status-enum.model';
import { Deployment } from '../../shared/models/deployment.model';
import { Page } from '../../shared/models/page.model';
import { DeploymentService } from '../../shared/services/deployment.service';
import { DeleteDialogComponent } from '../deployment-dialog/delete/delete-dialog.component';
import { TableDialogComponent } from '../deployment-dialog/deployment-table/table-dialog.component';
import { EditDialogComponent } from '../deployment-dialog/edit/edit-dialog.component';

@Component({
  selector: 'stgo-deployment-table',
  templateUrl: './deployment-table.component.html',
  styleUrls: ['./deployment-table.component.css']
})
export class DeploymentTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  type: string;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  deployments: Deployment[] = [];
  deploying = false;
  isLoading = false;
  loadingLogs = false;
  deployId: number;
  totalElements: number;
  displayedColumns: string[] = [
    'id',
    'site',
    'docroot',
    'environment',
    'version',
    'requester',
    'type',
    'status',
    'creationDate',
    'actions'
  ];
  searchValue: string;
  // auto refresh every 10 seconds
  refresh: Observable<number> = timer(0, 10000);

  private sub$: Subscription = new Subscription();

  constructor(
    private deploymentService: DeploymentService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.paginator.pageSize = 10;
    this.getAllDeployment('deploymentId', 'desc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sub$.add(this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.getAllDeployment(this.sort.active, this.sort.direction, this.searchValue);
    }));

    this.sub$.add(this.paginator.page.subscribe(() => {
      this.getAllDeployment(this.sort.active, this.sort.direction, this.searchValue);
    }));

    this.sub$.add(this.refresh.subscribe((seconds) =>
      this.getAllDeployment(this.sort.active, this.sort.direction, this.searchValue)
    ));
  }

  getAllDeployment(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    if (this.type === 'pending') {
      this.sub$.add(this.deploymentService
        .getDeployments(
          this.paginator.pageIndex,
          this.paginator.pageSize,
          sortField,
          sortDirection,
          DeploymentStatusEnum.REQUESTED,
          search
        )
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Deployment>) => {
          this.deployments = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }));
    } else {
      this.sub$.add(this.deploymentService
        .getDeployments(this.paginator.pageIndex, this.paginator.pageSize, sortField, sortDirection, '', search)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Deployment>) => {
          this.deployments = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }));
    }
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = '';
    }
    this.getAllDeployment(this.sort.active, this.sort.direction, this.searchValue);
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  deploy(deployment: Deployment): void {
    this.deploying = true;
    this.deployId = deployment.deploymentId;
    this.sub$.add(this.deploymentService
      .deploy(deployment.deploymentId)
      .pipe(
        finalize(() => {
          this.deploying = false;
        })
      )
      .subscribe(() => {
        this.filterElement(deployment);
      }));
  }

  filterElement(deployment: Deployment): void {
    this.deployments = this.deployments.filter((d: Deployment) => d.deploymentId !== deployment.deploymentId);
  }

  downloadLog(deployment: Deployment): void {
    this.loadingLogs = true;
    this.deployId = deployment.deploymentId;
    this.sub$.add(this.deploymentService
      .getLogs(deployment.deploymentId)
      .pipe(
        finalize(() => {
          this.loadingLogs = false;
        })
      )
      .subscribe((logs) => {
        if (logs && logs.entries) {
          let logData = '';

          logs.entries.forEach((entrie) => {
            const value: string =
              entrie.time +
              ' ' +
              entrie.absolute_time +
              ' ' +
              entrie.log +
              ' ' +
              entrie.level +
              ' ' +
              entrie.user +
              ' ' +
              entrie.stepctx +
              ' ' +
              entrie.node +
              `\n`;
            logData = logData + value;
          });

          this.openDialog(logData);
        }
      }));
  }

  openDialog(logData: string): void {
    this.dialog.open(TableDialogComponent, {
      width: '80%',
      data: { logs: logData }
    });
  }

  deleteItem(deployment: Deployment): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deployment }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.filterElement(deployment);
        this.refreshTable();
      }
    });
  }

  editItem(deployment: Deployment): void {
    this.sub$.add(this.deploymentService.getCommands(deployment.deploymentId).subscribe((commands) => {
      const dialogRef = this.dialog.open(EditDialogComponent, {
        width: '80%',
        height: '70%',
        data: { deployment, editDataSource: new MatTableDataSource(commands) }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.refreshTable();
        }
      });
    }));
  }

  private refreshTable(): void {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
