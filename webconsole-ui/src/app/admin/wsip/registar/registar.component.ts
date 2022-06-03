import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../shared/models/page.model';
import { Registar } from '../../../shared/models/registar.model';
import { RegistarService } from '../../../shared/services/registar.service';
import { EditRegistarDialogComponent } from './edit-registar-dialog/edit-registar-dialog.component';

@Component({
  selector: 'stgo-registar',
  templateUrl: './registar.component.html',
  styleUrls: ['./registar.component.css']
})
export class RegistarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  registars: Registar[] = [];
  displayedColumns: string[] = ['code', 'name', 'actions'];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  searchValue: string;
  private sub$ = new Subscription();

  constructor(public dialog: MatDialog, private registarService: RegistarService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllRegistars('code', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllRegistars(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllRegistars(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  openDialog(registar?: Registar): void {
    const dialogRef = this.dialog.open(EditRegistarDialogComponent, {
      width: '80%',
      height: '50%',
      data: { registar }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllRegistars(this.sort.active, this.sort.direction, this.searchValue);
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
    this.getAllRegistars(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getAllRegistars(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.registarService
      .getAllRegistars(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Registar>) => {
        this.totalElements = page.totalElements;
        this.registars = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
