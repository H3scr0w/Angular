import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AccessRight } from '../../../shared/models/access-right.model';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { AddRightComponent } from './dialog/add-right/add-right.component';
import { DeleteRightComponent } from './dialog/delete-right/delete-right.component';

@Component({
  selector: 'stgo-rights',
  templateUrl: './rights.component.html',
  styleUrls: ['./rights.component.scss']
})
export class RightsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  email: string;
  user: User;
  dataSource = new MatTableDataSource<AccessRight>();
  isLoading = false;
  displayedColumns: string[] = ['projectType', 'projectCode', 'projectName', 'role', 'actions'];

  private initSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.email = params.get('email')!;
      this.getUserRights(this.email);
    });
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.initSubscription.unsubscribe();
  }

  getUserRights(email: string): void {
    this.isLoading = true;
    this.initSubscription = this.userService
      .getUser(email)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((user: User) => {
        this.user = user;
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = user.accessrightByUsers;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addRight(): void {
    const dialogRef = this.dialog.open(AddRightComponent, {
      width: '80%',
      data: { user: this.user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getUserRights(this.email);
      }
    });
  }

  delete(element: AccessRight): void {
    const dialogRef = this.dialog.open(DeleteRightComponent, {
      width: '80%',
      data: { right: element }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getUserRights(this.email);
      }
    });
  }
}
