import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../../shared/models/page.model';
import { WebApp } from '../../../../shared/models/tools/qualys/webapp.model';
import { WebappService } from '../../../../shared/services/tools/qualys/webapp.service';
import { EditWebappDialogComponent } from './edit-webapp-dialog/edit-webapp-dialog.component';

@Component({
  selector: 'stgo-webapp',
  templateUrl: './webapp.component.html',
  styleUrls: ['./webapp.component.css']
})
export class WebappComponent implements OnInit, OnDestroy {
  ELEMENT_DATA: WebApp[] = [];
  datasource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['name', 'url', 'createdDate', 'updatedDate', 'actions'];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  isLoading = false;
  deleting = false;
  webAppName: string;

  private initSubscription: Subscription;
  private webappSubscription: Subscription;

  constructor(public dialog: MatDialog, private webappService: WebappService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.paginator.pageSize = 10;
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.getAllWebApps();
  }

  ngOnDestroy(): void {
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }

    if (this.webappSubscription) {
      this.webappSubscription.unsubscribe();
    }
  }

  getAllWebApps(): void {
    this.isLoading = true;
    this.initSubscription = this.webappService
      .getWebApps(this.paginator.pageIndex, this.paginator.pageSize)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<WebApp>) => {
        this.totalElements = page.totalElements;
        this.cdRef.detectChanges();
        this.datasource = new MatTableDataSource();
        this.datasource.data = page.content;
        this.datasource.sort = this.sort;
      });
  }

  openDialog(webApp?: WebApp): void {
    const dialogRef = this.dialog.open(EditWebappDialogComponent, {
      width: '80%',
      data: { webApp }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllWebApps();
      }
    });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  delete(webApp: WebApp): void {
    this.deleting = true;
    this.webAppName = webApp.name;
    this.webappSubscription = this.webappService
      .deleteWebApp(webApp.id)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.datasource.data = this.datasource.data.filter((webapp) => webapp.name !== this.webAppName);
        this.cdRef.detectChanges();
      });
  }
}
