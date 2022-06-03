import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { CostUpperLimit } from '../../../shared/models/cost-upper-limit.model';
import { Page } from '../../../shared/models/page.model';
import { CostUpperLimitService } from '../../../shared/service/cost-upper-limit/cost-upper-limit.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { CostUpperLimitDialogComponent } from '../cost-upper-limit-dialog/cost-upper-limit-dialog.component';

@Component({
  selector: 'stgo-cost-upper-limit-list',
  templateUrl: './cost-upper-limit-list.component.html',
  styleUrls: ['./cost-upper-limit-list.component.css']
})
export class CostUpperLimitListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  searchValue: string;
  costUpperLimit: CostUpperLimit[] = [];
  totalElements: number;
  displayedColumns: string[] = ['id', 'label', 'value', 'actions'];
  dataSource: MatTableDataSource<any>;
  costUpperLimitTemplateForm = this.fb.group({
    costupperLimitArray: this.fb.array([])
  });
  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  isAdmin: boolean;
  isOrderUser: boolean;
  disabledUpdate = true;

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private costUpperLimitService: CostUpperLimitService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;

    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.pageIndex = 0;
      this.searchValue = searchTextValue;
      this.getCostUpperLimits(this.sort.active, this.sort.direction, this.searchValue);
    });
    this.sub$.add(this.filter$);
  }

  ngAfterViewInit() {
    this.getCostUpperLimits('id', 'asc');
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getCostUpperLimits(this.sort.active, this.sort.direction, this.searchValue);
      });
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getCostUpperLimits(this.sort.active, this.sort.direction, this.searchValue);
      });
    }
    this.cdRef.detectChanges();
  }

  onSubmit(): void {
    this.costUpperLimit = this.costUpperLimitTemplateForm.get('costupperLimitArray').value;

    this.sub$.add(
      this.costUpperLimitService.updateCostUpperLimits(this.costUpperLimit).subscribe(res => {
        this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
      })
    );
  }

  editCostUpperLimt(template: FormGroup): void {
    const costUpperLimit: CostUpperLimit = template.value;
    this.dialog
      .open(CostUpperLimitDialogComponent, {
        width: '800px',
        disableClose: true,
        data: { costUpperLimit, mode: 'edit' }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.getCostUpperLimits(this.sort.active, this.sort.direction, this.searchValue);
        }
      });
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  private getAllAsFormArray(page: Page<CostUpperLimit>): Observable<FormArray> {
    const costUpperLimits: CostUpperLimit[] = page.content;
    const fgs = costUpperLimits.map(this.asFormGroup);
    this.totalElements = page.totalElements;
    this.cdRef.detectChanges();
    return of(new FormArray(fgs));
  }

  private asFormGroup(costUpperLimit: CostUpperLimit): FormGroup {
    const fg = new FormGroup({
      id: new FormControl(costUpperLimit.id ? costUpperLimit.id : null),
      label: new FormControl(costUpperLimit.label ? costUpperLimit.label : null),
      value: new FormControl(costUpperLimit.value ? costUpperLimit.value : null)
    });
    return fg;
  }

  private getCostUpperLimits(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.sub$.add(
      this.costUpperLimitService
        .getAllCostUpperLimits(search, this.pageIndex, this.pageSize, sortField, sortDirection)
        .pipe(mergeMap((page: Page<CostUpperLimit>) => this.getAllAsFormArray(page)))
        .subscribe((formArray: FormArray) => {
          this.isLoading = false;
          this.costUpperLimitTemplateForm.setControl('costupperLimitArray', formArray);
          this.dataSource = new MatTableDataSource(
            (this.costUpperLimitTemplateForm.get('costupperLimitArray') as FormArray).controls
          );
          this.dataSource.filterPredicate = (data: FormGroup, filter: string) => {
            return Object.values(data.controls).some(x => x.value === filter);
          };
        })
    );
  }
}
