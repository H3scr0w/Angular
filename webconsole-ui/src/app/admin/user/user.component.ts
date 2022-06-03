import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../shared/models/page.model';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { EditUserComponent } from './dialog/edit-user/edit-user.component';

@Component({
  selector: 'stgo-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  users: User[] = [];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  displayedColumns: string[] = ['email', 'firstname', 'lastname', 'company', 'isAdmin', 'actions'];
  searchValue: string;
  private sub$: Subscription = new Subscription();

  constructor(private userService: UserService, private cdRef: ChangeDetectorRef, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => {
      this.pageIndex = 0;
      this.getAllUsers(this.sort.active, this.sort.direction, this.searchValue);
    });

    this.paginator.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.getAllUsers(this.sort.active, this.sort.direction, this.searchValue);
    });
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
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
    this.getAllUsers(this.sort.active, this.sort.direction, this.searchValue);
  }

  openDialog(user?: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '80%',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers(this.sort.active, this.sort.direction, this.searchValue);
      }
    });
  }

  lockUnlock(user: User): void {
    if (!user) {
      return;
    }
    this.isLoading = true;
    this.sub$.add(this.userService
      .lockUnlock(user.email)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.getAllUsers(this.sort.active, this.sort.direction, this.searchValue);
      }));
  }

  private getAllUsers(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.userService
      .getUsers(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((users: Page<User>) => {
        this.totalElements = users.totalElements;
        this.users = users.content;
        this.cdRef.detectChanges();
      }));
  }
}
