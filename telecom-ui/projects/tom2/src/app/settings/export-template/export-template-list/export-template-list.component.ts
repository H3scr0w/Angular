import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../../../../sirene/src/app/shared';
import { AuthenticationService } from '../../../core';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CsvParameter } from '../../../shared/models/csv-parameter';
import { Operator } from '../../../shared/models/operators';
import { CsvParameterService } from '../../../shared/service/csvparameter/csv-parameter.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { OperatorsService } from '../../../shared/service/operators/operators.service';

@Component({
  selector: 'stgo-export-template-list',
  templateUrl: './export-template-list.component.html',
  styleUrls: ['./export-template-list.component.scss']
})
export class ExportTemplateListComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  csvParameter: CsvParameter[] = null;
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 200;
  filterCount = 0;
  displayedColumns: string[] = ['name', 'actions'];
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;
  operators: Operator[];
  isCsvParameterExist: boolean;

  private sub$: Subscription = new Subscription();

  exportTemplateForm = this.fb.group({
    object: [''],
    operator: ['']
  });

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private csvParameterService: CsvParameterService,
    private operatorsService: OperatorsService,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isPmUser = this.authenticationService.credentials.isPmUser;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;
    this.getAllOperators('name', 'asc');
    this.isCsvParameterExist = false;
    this.exportTemplateForm.get('object').setValue('O');
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  getExportList(): void {
    const csvParameterFilter: CsvParameter = new CsvParameter(
      '',
      this.exportTemplateForm.controls.operator.value,
      null,
      this.exportTemplateForm.controls.object.value
    );
    if (this.exportTemplateForm.get('operator').value) {
      this.getAllCsvParameters('', 'asc', '', csvParameterFilter);
    }
  }

  drop(event: CdkDragDrop<CsvParameter[]>) {
    moveItemInArray(this.csvParameter, event.previousIndex, event.currentIndex);
  }

  saveExportList(): void {
    let columnNumber = 1;
    this.csvParameter.forEach(element => {
      element.columnNumber = columnNumber++;
    });
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.update.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.csvParameterService
          .updateAll(this.csvParameter)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(respone => {
            this.messageService.show(this.translateService.instant('exporttemplate.save'), 'success');
          });
      }
    });
  }

  private getAllCsvParameters(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    csvParameterFilter?: CsvParameter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.csvParameterService
        .getAllCsvParameter(this.pageIndex, this.pageSize, sortField, sortDirection, search, csvParameterFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<CsvParameter>) => {
          if (page) {
            this.isCsvParameterExist = page.content.length > 0 ? true : false;
            this.csvParameter = page.content.sort((a, b) => a.columnNumber - b.columnNumber);
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }

  private getAllOperators(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.operatorsService
        .getAllOperators(this.pageIndex, this.pageSize, sortField, sortDirection, search)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Operator>) => {
          if (page) {
            this.operators = page.content.sort((a, b) => a.name.localeCompare(b.name));
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
