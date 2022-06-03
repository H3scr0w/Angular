import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CspModel } from 'src/app/shared/models/csp.model';
import { CspService } from 'src/app/shared/service/csp/csp.service';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CompanyModel } from '../../../shared/models/company.model';
import { Page } from '../../../shared/models/page.model';
import { CompanyService } from '../../../shared/service/company/company.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { CompanyCommentDialogComponent } from '../company-comment/company-comment-dialog.component';

@Component({
  selector: 'stgo-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = ['codeSif', 'codeAmundi', 'societeLibelle', 'flagAdherente', 'cspId', 'actions'];
  isLoading = false;
  isAdherentLoading = false;
  isCspLoading = false;
  companyList: Observable<CompanyModel[]>;
  companies: CompanyModel[] = [];
  cspIdList: string[] = [];
  editCompany: CompanyModel;
  oldCompany: CompanyModel;
  addCompany: CompanyModel;
  hideFirstRow = true;
  isAdmin: boolean;
  companyAdherentesCount = 0;
  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private translateService: TranslateService,
    private companyService: CompanyService,
    private cspService: CspService,
    private authenticationService: AuthenticationService
  ) {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.getAllCompanies('societeSid', 'asc');
    this.getFlagAdherentCompanies();
    this.getAllCsp();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllCompanies(this.sort.active, this.sort.direction);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllCompanies(this.sort.active, this.sort.direction);
      });
    }

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  editRow(company: CompanyModel): void {
    this.hideFirstRow = true;
    this.editCompany = null!;
    this.addCompany = null!;
    if (!company) {
      return;
    }
    this.editCompany = company.societeSid ? company : null!;
    this.oldCompany = { ...this.editCompany };
  }

  addRow(): void {
    this.cancelEdit();
    this.hideFirstRow = false;
    const company: CompanyModel = this.companies[0];
    if (!company) {
      return;
    }
    this.addCompany = company.societeSid === 0 ? company : null!;
    this.oldCompany = { ...this.addCompany };
  }

  cancelEdit(): void {
    let companiesEdit: CompanyModel[] = [];
    this.hideFirstRow = true;
    this.editCompany = null!;
    this.addCompany = null!;
    if (this.oldCompany && (this.oldCompany.societeSid || this.oldCompany.societeSid === 0)) {
      if (this.companies.length <= 0) {
        return;
      } else {
        companiesEdit = this.companies.map((company) => company);
        const index = companiesEdit.findIndex((item) => item.societeSid === this.oldCompany.societeSid);
        companiesEdit.splice(index, 1, this.oldCompany);
        this.companies = companiesEdit.map((companyEdit) => companyEdit);
      }
    }
  }

  saveCompany(): void {
    this.isLoading = true;
    if (this.editCompany) {
      this.sub$.add(
        this.companyService
          .updateCompany(this.editCompany)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res: CompanyModel) => {
            if (res) {
              this.editCompany = null!;
              this.messageService.show(this.translateService.instant('company.save.success.message'), 'success');
              this.getAllCompanies(this.sort.active, this.sort.direction);
            }
          })
      );
    } else if (this.addCompany) {
      this.sub$.add(
        this.companyService
          .addCompany(this.addCompany)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res: CompanyModel) => {
            if (res) {
              this.addCompany = null!;
              this.messageService.show(this.translateService.instant('company.create.success.message'), 'success');
              this.companies.push(res);
              this.totalElements = this.totalElements + 1;
              this.cdRef.detectChanges();
            }
          })
      );
    }
  }

  addComment(data: CompanyModel): void {
    const dialogRef = this.dialog.open(CompanyCommentDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { company: data }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'close') {
        this.getAllCompanies(this.sort.active, this.sort.direction);
      }
    });
  }

  deleteCompany(company: CompanyModel): void {
    this.cancelEdit();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: {
        header: this.translateService.instant('common.deletion'),
        title: this.translateService.instant('company.delete.record.label'),
        record: company.societeLibelle
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && company) {
        this.isLoading = true;
        this.companyService
          .deleteCompany(company.societeSid)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(() => {
            this.messageService.show(this.translateService.instant('company.delete.success.message'), 'success');
            this.getAllCompanies(this.sort.active, this.sort.direction);
          });
      }
    });
  }

  exportDetails(): void {
    this.isLoading = true;
    this.sub$.add(
      this.companyService
        .downloadCompanies()
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((excelContent: Blob) => {
          if (excelContent) {
            const blob = new Blob([excelContent], { type: 'application/octet-stream' });
            saveAs(blob, 'Companies.xlsx');
          }
        })
    );
  }

  private getAllCompanies(sortField?: string, sortDirection?: SortDirection): void {
    this.isLoading = true;
    this.sub$.add(
      this.companyService
        .getAllCompanies(this.pageIndex, this.pageSize, sortField, sortDirection)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<CompanyModel>) => {
          if (page) {
            this.companies = page.content;
            this.companies.unshift({
              societeSid: 0,
              societeLibelle: '',
              codeSif: '',
              codeAmundi: '',
              flagAdherente: false,
              cspId: '',
              comments: ''
            });
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }

  private getFlagAdherentCompanies(): void {
    this.isAdherentLoading = true;
    this.sub$.add(
      this.companyService
        .getFlagAdherentCompanies()
        .pipe(finalize(() => (this.isAdherentLoading = false)))
        .subscribe((res: number) => {
          if (res) {
            this.companyAdherentesCount = res;
            this.cdRef.detectChanges();
          }
        })
    );
  }

  private getAllCsp(): void {
    this.isCspLoading = true;
    this.sub$.add(
      this.cspService
        .getAllCsp()
        .pipe(finalize(() => (this.isCspLoading = false)))
        .subscribe((cspList: CspModel[]) => {
          if (cspList && cspList.length > 0) {
            this.cspIdList = cspList.map((csp) => csp.cspId as string);
          }
        })
    );
  }
}
