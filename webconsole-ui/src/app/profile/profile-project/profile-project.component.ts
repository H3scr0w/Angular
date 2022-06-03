import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from '@core';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../shared/models/page.model';
import { UserProject } from '../../shared/models/user-project.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'stgo-profile-project',
  templateUrl: './profile-project.component.html',
  styleUrls: ['./profile-project.component.css']
})
export class ProfileProjectComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  isLoading = false;
  totalElements: number;
  projects: UserProject[] = [];
  displayedColumns: string[] = ['type', 'code', 'name'];
  searchValue: string;
  private initSubscription: ISubscription;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.paginator.pageSize = 10;
    this.getAllProjects();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.getAllProjects(this.searchValue);
    });
  }

  getAllProjects(search?: string): void {
    this.isLoading = true;
    this.initSubscription = this.userService
      .getUserProjects(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.authenticationService.credentials.email,
        search
      )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<UserProject>) => {
        this.totalElements = page.totalElements;
        this.projects = page.content;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.initSubscription.unsubscribe();
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = '';
    }
    this.getAllProjects(this.searchValue);
  }
}
