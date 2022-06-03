import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith } from 'rxjs/operators';
import { FundModel, FundTypes } from '../../../shared/models/fund.model';
import { Page } from '../../../shared/models/page.model';
import { TenantAccountModel } from '../../../shared/models/tenant-account.model';
import { FundService } from '../../../shared/service/fund/fund.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { TenantAccountService } from '../../../shared/service/tenant-account/tenant-account.service';

@Component({
  selector: 'stgo-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = ['amundiCode', 'fundLabel', 'fundGroupId', 'tenantAccounts', 'active', 'actions'];
  isLoading = false;
  funds: FundModel[] = [];
  fundGroupIdList: string[] = ['DIV', 'PCL', 'SPE', 'PAI'];
  editFund: FundModel;
  oldFund: FundModel;
  addFund: FundModel;
  hideFirstRow = true;
  tenantAccounts: TenantAccountModel[];
  inputTenantAccount: Subject<string> = new Subject<string>();
  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private fundService: FundService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private tenantAccountService: TenantAccountService
  ) {
    this.getAllFunds('codeFondsAmundi', 'asc');

    this.inputTenantAccount.pipe(startWith(''), debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      this.getAllTenantAccounts(value);
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllFunds(this.sort.active, this.sort.direction);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllFunds(this.sort.active, this.sort.direction);
      });
    }

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  editRow(fund: FundModel): void {
    this.hideFirstRow = true;
    this.editFund = null!;
    this.addFund = null!;
    if (!fund) {
      return;
    }
    this.editFund = fund.fundId ? fund : null!;
    if (this.editFund && this.editFund.fundGroupId) {
      this.editFund.fundGroupId = this.editFund.fundGroupId.trim();
    }
    if (!fund.tenantAccount) {
      this.editFund.tenantAccount = new TenantAccountModel(0, '');
    }
    this.oldFund = { ...this.editFund };
  }

  addRow(): void {
    this.cancelEdit();
    this.hideFirstRow = false;
    const fund: FundModel = this.funds[0];
    if (!fund) {
      return;
    }
    this.addFund = fund.fundId === 0 ? fund : null!;
    this.oldFund = { ...this.addFund };
  }

  cancelEdit(): void {
    let fundsEdit: FundModel[] = [];

    if (
      this.tenantAccounts.length > 0 &&
      this.editFund &&
      this.editFund.tenantAccount &&
      this.editFund.tenantAccount.teneurCompteLibelle !== ''
    ) {
      this.tenantAccounts.forEach((tenantAccount) => {
        if (
          this.editFund.tenantAccount &&
          tenantAccount.teneurCompteLibelle === this.editFund.tenantAccount.teneurCompteLibelle
        ) {
          this.editFund.tenantAccount.teneurCompteId = tenantAccount.teneurCompteId;
        }
      });
    }

    if (this.editFund && this.editFund.tenantAccount && this.editFund.tenantAccount.teneurCompteLibelle === '') {
      this.editFund.tenantAccount.teneurCompteId = 0;
    }

    if (this.addFund && this.addFund.tenantAccount && this.addFund.tenantAccount.teneurCompteLibelle === '') {
      this.addFund.tenantAccount.teneurCompteId = 0;
    }

    this.hideFirstRow = true;
    this.editFund = null!;
    this.addFund = null!;
    if (this.oldFund && (this.oldFund.fundId || this.oldFund.fundId === 0)) {
      if (this.funds.length <= 0) {
        return;
      } else {
        fundsEdit = this.funds.map((fund) => fund);
        const index = fundsEdit.findIndex((item) => item.fundId === this.oldFund.fundId);
        fundsEdit.splice(index, 1, this.oldFund);
        this.funds = fundsEdit.map((fundEdit) => fundEdit);
      }
    }
  }

  exportDetails(): void {
    this.isLoading = true;
    this.sub$.add(
      this.fundService
        .downloadFunds(null!, [FundTypes.DIV, FundTypes.PCL, FundTypes.PAI, FundTypes.SPE])
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((excelContent: Blob) => {
          if (excelContent) {
            const blob = new Blob([excelContent], { type: 'application/octet-stream' });
            saveAs(blob, 'Fonds.xlsx');
          }
        })
    );
  }

  saveFund(): void {
    this.isLoading = true;
    if (this.editFund) {
      this.sub$.add(
        this.fundService
          .updateFund(this.editFund)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res: FundModel) => {
            if (res) {
              this.editFund = null!;
              this.messageService.show(this.translateService.instant('fund.save.success.message'), 'success');
              this.getAllFunds(this.sort.active, this.sort.direction);
            }
          })
      );
    } else if (this.addFund) {
      this.sub$.add(
        this.fundService
          .createFund(this.addFund)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res: FundModel) => {
            if (res) {
              this.addFund = null!;
              this.messageService.show(this.translateService.instant('fund.create.success.message'), 'success');
              this.funds.push(res);
              this.totalElements = this.totalElements + 1;
              this.hideFirstRow = true;
              this.getAllFunds(this.sort.active, this.sort.direction);
            }
          })
      );
    }
  }

  private getAllFunds(sortField?: string, sortDirection?: SortDirection): void {
    this.isLoading = true;
    this.sub$.add(
      this.fundService
        .getAllFunds(
          this.pageIndex,
          this.pageSize,
          sortField,
          sortDirection,
          '',
          [FundTypes.DIV, FundTypes.PCL, FundTypes.PAI, FundTypes.SPE],
          false
        )
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<FundModel>) => {
          if (page) {
            this.funds = page.content;
            this.funds.unshift({
              fundId: 0,
              amundiCode: '',
              fundLabel: '',
              fundGroupId: '',
              isDefault: false,
              isActive: false,
              tenantAccount: new TenantAccountModel(0, '')
            });
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }

  private getAllTenantAccounts(value: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.tenantAccountService
        .getAllTenantAccounts(0, 50, 'teneurCompteLibelle', 'asc', value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<TenantAccountModel>) => {
          if (page) {
            this.tenantAccounts = page.content.sort((a, b) =>
              a.teneurCompteLibelle.localeCompare(b.teneurCompteLibelle)
            );
          }
        })
    );
  }
}
