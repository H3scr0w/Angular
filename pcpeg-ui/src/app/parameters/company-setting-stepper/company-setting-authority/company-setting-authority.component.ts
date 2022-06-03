import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FacilitySettingDialogComponent } from 'src/app/shared/components/facility-setting-dialog/facility-setting-dialog.component';
import { UserDialogMode } from 'src/app/shared/components/user-dialog/user-dialog-data';
import { UserDialogComponent } from 'src/app/shared/components/user-dialog/user-dialog.component';
import { FacilityModel } from 'src/app/shared/models/facility.model';
import { UserDirectoryModel } from 'src/app/shared/models/user-directory-model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CampaignModel } from '../../../shared/models/campaign.model';
import { Page } from '../../../shared/models/page.model';
import { MessageService } from '../../../shared/service/message/message.service';
import { AuthorityModel } from './../../../shared/models/authority.model';
import { AuthorityService } from './../../../shared/service/authority/authority.service';
import { CompanyService } from './../../../shared/service/company/company.service';

@Component({
  selector: 'stgo-company-setting-authority',
  templateUrl: './company-setting-authority.component.html',
  styleUrls: ['./company-setting-authority.component.scss']
})
export class CompanySettingAuthorityComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  stepper: MatStepper;

  @Input()
  campaign: CampaignModel;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = ['sgid', 'name', 'firstname', 'email', 'telephone', 'perimeter', 'category', 'actions'];
  isLoading = false;
  authorities: AuthorityModel[] = [];
  editAuthority: AuthorityModel;
  oldAuthority: AuthorityModel;
  addAuthority: AuthorityModel;
  categories: string[] = ['CSP', 'RH'];
  hideFirstRow = true;
  readOnly = false;

  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private authorityService: AuthorityService,
    private companyService: CompanyService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.campaign && !this.campaign.flagEnCours) {
      this.readOnly = true;
    }
  }

  ngAfterViewInit(): void {
    this.getAllAuthorities('habilitationsSid', 'desc');

    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllAuthorities(this.sort.active, this.sort.direction);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllAuthorities(this.sort.active, this.sort.direction);
      });
    }
    this.cdRef.detectChanges();

    // if all settings already validated
    if (this.campaign && this.campaign.statutId === 4) {
      this.validateStatus();
    }
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  getAllAuthorities(sortField?: string, sortDirection?: SortDirection): void {
    if (this.campaign && this.campaign.id) {
      this.isLoading = true;
      this.sub$.add(
        this.authorityService
          .getCompanyAuthoritySettings(
            this.campaign.id.societeSid,
            this.pageIndex,
            this.pageSize,
            sortField,
            sortDirection
          )
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((page: Page<AuthorityModel>) => {
            if (page) {
              this.authorities = page.content;
              this.authorities.unshift({
                id: 0,
                name: '',
                firstname: '',
                sgid: '',
                facility: null!,
                category: '',
                year: ''
              });
              this.totalElements = page.totalElements;
              this.cdRef.detectChanges();
            }
          })
      );
    }
  }

  editRow(authority: AuthorityModel): void {
    this.hideFirstRow = true;
    this.editAuthority = null!;
    this.addAuthority = null!;
    if (!authority) {
      return;
    }
    this.editAuthority = authority.id ? authority : null!;
    this.oldAuthority = { ...this.editAuthority };
  }

  addRow(): void {
    this.cancelEdit();
    this.hideFirstRow = false;
    const authority: AuthorityModel = this.authorities[0];
    if (!authority) {
      return;
    }
    this.addAuthority = authority.id === 0 ? authority : null!;
    this.oldAuthority = { ...this.addAuthority };
  }

  cancelEdit(): void {
    let authoritiesEdit: AuthorityModel[] = [];
    this.hideFirstRow = true;
    this.editAuthority = null!;
    this.addAuthority = null!;
    if (this.oldAuthority && (this.oldAuthority.id || this.oldAuthority.id === 0)) {
      if (this.authorities.length <= 0) {
        return;
      } else {
        authoritiesEdit = this.authorities.map((auth) => auth);
        const index = authoritiesEdit.findIndex((item) => item.id === this.oldAuthority.id);
        authoritiesEdit.splice(index, 1, this.oldAuthority);
        this.authorities = authoritiesEdit.map((auth) => auth);
      }
    }
  }

  saveAuthority(): void {
    this.isLoading = true;
    if (this.editAuthority && this.campaign.id) {
      this.sub$.add(
        this.authorityService
          .createOrUpdateCompanyAuthoritySetting(this.campaign.id.societeSid, this.editAuthority)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res: AuthorityModel) => {
            if (res) {
              this.editAuthority = null!;
              this.messageService.show(this.translateService.instant('authority.save.success.message'), 'success');
              this.getAllAuthorities(this.sort.active, this.sort.direction);
            }
          })
      );
    } else if (this.addAuthority && this.campaign.id) {
      this.sub$.add(
        this.authorityService
          .createOrUpdateCompanyAuthoritySetting(this.campaign.id.societeSid, this.addAuthority)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res: AuthorityModel) => {
            if (res) {
              this.addAuthority = null!;
              this.messageService.show(this.translateService.instant('authority.create.success.message'), 'success');
              this.authorities.push(res);
              this.totalElements = this.totalElements + 1;
              this.hideFirstRow = true;
              this.getAllAuthorities(this.sort.active, this.sort.direction);
            }
          })
      );
    }
  }

  deleteAuthority(authority: AuthorityModel): void {
    this.cancelEdit();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: { message: this.translateService.instant('authority.delete.confirmation.message') }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && authority && this.campaign.id) {
        this.isLoading = true;
        this.authorityService
          .deleteCompanyAuthoritySetting(authority.id, this.campaign.id.societeSid)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(() => {
            this.messageService.show(this.translateService.instant('authority.delete.success.message'), 'success');
            this.getAllAuthorities(this.sort.active, this.sort.direction);
          });
      }
    });
  }

  back(): void {
    this.stepper.previous();
  }

  validate(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: { message: this.translateService.instant('company.setting.authority.confirmation.message') }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.campaign.id) {
        this.isLoading = true;
        this.companyService
          .validateCompanySettings(this.campaign.id.societeSid)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(() => {
            this.messageService.show(
              this.translateService.instant('company.setting.authority.confirmation.success'),
              'success'
            );
            this.validateStatus();
            this.router.navigate(['parameters']);
          });
      }
    });
  }

  selectPerimeter(authority: AuthorityModel): void {
    if (authority?.id === this.editAuthority?.id || authority?.id === this.addAuthority?.id) {
      const dialogRef = this.dialog.open(FacilitySettingDialogComponent, {
        width: '600px',
        disableClose: true,
        hasBackdrop: false,
        autoFocus: true,
        data: { authority, societeSid: this.campaign.id!.societeSid }
      });
      dialogRef.afterClosed().subscribe((result: FacilityModel | string) => {
        if (typeof result === 'string') {
          if (result === 'close') {
            return;
          } else {
            authority.facility = null!;
          }
        } else {
          if (result && result.codeSif) {
            authority.facility = result;
          }
        }
        this.cdRef.detectChanges();
      });
    }
  }

  addUser(authority: AuthorityModel): void {
    if (authority) {
      const dialogRef = this.dialog.open(UserDialogComponent, {
        width: '400px',
        disableClose: true,
        autoFocus: true,
        data: { campaignData: authority, mode: UserDialogMode.AUTHORITY }
      });
      dialogRef.afterClosed().subscribe((result: UserDirectoryModel) => {
        if (result && result.stGoSGI) {
          authority.sgid = result.stGoSGI;
          authority.firstname = result.givenName;
          authority.name = result.sn;
          authority.email = result.mail;
          authority.telephone = result.telephoneNumber;
        }
      });
    }
  }

  private validateStatus(): void {
    setTimeout(() => {
      this.stepper.selected.editable = true;
      this.stepper.selected.completed = true;
      this.stepper.next();
      this.cdRef.detectChanges();
    }, 2000);
  }
}
