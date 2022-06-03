import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { Docroot } from '../../../shared/models/docroot.model';
import { Environment } from '../../../shared/models/environment.model';
import { Page } from '../../../shared/models/page.model';
import { DocrootService } from '../../../shared/services/docroot.service';
import { AddDocrootenvDialogComponent } from './add-docrootenv/add-docrootenv-dialog.component';
import { EditDocrootenvDialogComponent } from './edit-docrootenv/edit-docrootenv-dialog.component';

@Component({
  selector: 'stgo-docrootenv',
  templateUrl: './docrootenv.component.html',
  styleUrls: ['./docrootenv.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocrootenvComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  screen = 'docroot';
  displayedColumns: string[] = ['environment', 'servers', 'loadBalancers', 'actions'];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  deleting = false;
  envCode: string;
  docroots$: Observable<Docroot[]>;
  selectedEnvironment: Environment;
  environments: Environment[] = [];
  docrootEnvForm: FormGroup;
  searchValue: string;
  private sub$ = new Subscription();

  constructor(public dialog: MatDialog, private docrootService: DocrootService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.docrootEnvForm = new FormGroup({
      docroot: new FormControl('')
    });

    this.docroots$ = this.docrootEnvForm.controls.docroot.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.docrootService.getAllDocrootsByName(query).pipe(map((page) => page.content));
      })
    );
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllDocrootEnvs(this.docrootEnvForm.get('docroot')!.value.code,
          this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllDocrootEnvs(this.docrootEnvForm.get('docroot')!.value.code,
          this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  changeDocroot(docroot: Docroot): void {
    this.getAllDocrootEnvs(docroot.code);
  }

  closed(): void {
    const docrootVal = this.docrootEnvForm.controls.docroot.value;

    if (!docrootVal) {
      this.environments = [];
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDocrootenvDialogComponent, {
      width: '80%',
      height: '70%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      const docroot: Docroot = this.docrootEnvForm.get('docroot')!.value;
      if (docroot && docroot.code) {
        this.getAllDocrootEnvs(docroot.code);
      }
    });
  }

  editDocrootEnv(environmentCode?: string): void {
    const dialogRef = this.dialog.open(EditDocrootenvDialogComponent, {
      width: '80%',
      data: { docrootCode: this.docrootEnvForm.get('docroot')!.value.code, environmentCode }
    });

    dialogRef.afterClosed().subscribe((result) => {
      const docroot: Docroot = this.docrootEnvForm.get('docroot')!.value;
      if (docroot && docroot.code) {
        this.getAllDocrootEnvs(docroot.code);
      }
    });
  }

  applyFilter(event: KeyboardEvent): void {
    const docrootCode = this.docrootEnvForm.get('docroot')!.value.code;
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = '';
    }
    this.getAllDocrootEnvs(docrootCode, this.sort.active, this.sort.direction, this.searchValue);
  }

  displayFn(docroot?: Docroot): string {
    if (docroot) {
      return docroot.name;
    }
    return '';
  }

  deleteEnv(envCode: string): void {
    const docrootCode = this.docrootEnvForm.get('docroot')!.value.code;
    this.deleting = true;
    this.envCode = envCode;
    this.sub$.add(this.docrootService
      .deleteDocrootEnv(envCode, docrootCode)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.getAllDocrootEnvs(docrootCode);
      }));
  }

  selectedRow(row: Environment, screen: string): void {
    this.selectedEnvironment = row;
    this.screen = screen;
  }

  private getAllDocrootEnvs(
    docrootCode: string,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string): void {
    if (docrootCode) {
      this.isLoading = true;
      this.sub$.add(this.docrootService
        .getAllEnvironments(docrootCode, this.pageIndex, this.pageSize, sortField, sortDirection, search)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Environment>) => {
          this.environments = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }));
    }
  }
}
