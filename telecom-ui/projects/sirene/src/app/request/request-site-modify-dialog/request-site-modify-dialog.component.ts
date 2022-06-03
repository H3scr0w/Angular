import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, Site, SiteService } from '@shared';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { RequestActionType } from '../../shared/models/dropdown-type';
import { SiteDeletionRequest } from '../../shared/models/site-deletion-request';
import { SiteModificationRequest } from '../../shared/models/site-modification-request';
import { SiteDeletionRequestService } from '../../shared/services/site-deletion-request/site-deletion-request.service';
import { SiteModificationRequestService } from '../../shared/services/site-modification-request/site-modification-request.service';
import { RequestDialogData } from '../request-dialog-data';
import { RequestSiteCreateDialogComponent } from '../request-site-create-dialog/request-site-create-dialog.component';

@Component({
  selector: 'stgo-request-site-modify-dialog',
  templateUrl: './request-site-modify-dialog.component.html',
  styleUrls: ['./request-site-modify-dialog.component.scss']
})
export class RequestSiteModifyDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  sitesCount = 0;
  usersCount = 0;
  btnSaveText: string;
  siteModificationRequest: SiteModificationRequest;
  siteDeletionRequest: SiteDeletionRequest;
  isValidate: boolean;
  isArchiveRequest: boolean;
  isViewOnly: boolean;
  modifyRequestSiteForm = this.fb.group({
    id: [''],
    siteName: [''],
    comments: [''],
    country: [''],
    city: [''],
    address: [''],
    postCode: [''],
    siteCode: ['']
  });

  private sub$: Subscription = new Subscription();

  constructor(
    private messageService: MessageService,
    private translateService: TranslateService,
    private siteService: SiteService,
    private siteModificationRequestService: SiteModificationRequestService,
    private siteDeletionRequestService: SiteDeletionRequestService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RequestSiteModifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestDialogData
  ) {}

  ngOnInit() {
    this.isValidate = false;
    this.isViewOnly = false;
    if (this.data) {
      this.isViewOnly = this.data.viewOnly;
      if (this.data.mode === 'request') {
        this.getSiteRequest(this.data.siteCode);
      } else if (this.data.mode === 'validate') {
        this.isValidate = true;
        this.btnSaveText = 'request.validate';
        if (this.data.action === RequestActionType.Modification) {
          this.getSiteModificationRequest(this.data.id);
        } else if (this.data.action === RequestActionType.Deletion) {
          this.getSiteDeletionRequest(this.data.id);
        }
      }
    }
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.modifyRequestSiteForm.controls[controlName].hasError(errorName);
  }

  getSite(): void {
    const siteCode = this.modifyRequestSiteForm.controls.siteName.value.split('-')[0];
    if (siteCode) {
      const dialogRef = this.dialog.open(RequestSiteCreateDialogComponent, {
        width: '800px',
        disableClose: true,
        data: {
          id: this.data.id,
          mode: 'validate',
          siteCode,
          action: this.data.action,
          comment: this.modifyRequestSiteForm.controls.comments.value
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'validated') {
          this.siteModificationRequestAndValidation();
        } else {
          this.dialogRef.close('close');
        }
      });
    } else {
      this.dialogRef.close('close');
    }
  }

  onSubmit(): void {
    if (this.modifyRequestSiteForm.valid && this.data) {
      if (this.data.mode === 'request' && this.data.action === RequestActionType.Modification) {
        this.createSiteModificationRequest();
      } else if (this.data.mode === 'request' && this.data.action === RequestActionType.Deletion) {
        this.createSiteDeletionRequest();
      }
    }
  }

  deleteSite(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.delete.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.siteDeletionRequestAndValidation();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  private getSiteRequest(siteCode: string): void {
    this.btnSaveText = 'request.Send';
    if (siteCode) {
      this.isLoading = true;
      this.sub$.add(
        this.siteService
          .getSiteById(siteCode)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((site: Site) => {
            if (site && !site.archiveDate) {
              const sitecode = site.siteCode ? site.siteCode + '-' : '';
              const city = site.city ? site.city.country.name + '-' : '';
              const company = site.company ? site.company.companyName + '-' : '';
              const usualName = site.usualName ? site.usualName : '';
              this.modifyRequestSiteForm.setValue({
                siteName: sitecode + city + company + usualName,
                comments: '',
                country: site.city ? site.city.country.name : '',
                city: site.city ? site.city.name : '',
                address: site.address1 ? site.address1 : '',
                postCode: site.postCode ? site.postCode : '',
                siteCode: site.siteCode ? site.siteCode : '',
                id: 0
              });
            } else {
              this.dialogRef.close('close');
              this.messageService.show(this.translateService.instant('common.save.notexist.message'), 'error');
            }
          })
      );
    }
  }

  private getSiteModificationRequest(id: number): void {
    this.isLoading = true;
    this.sub$.add(
      this.siteModificationRequestService
        .getSiteModificationRequestById(id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((site: SiteModificationRequest) => {
          if (site) {
            this.modifyRequestSiteForm.setValue({
              siteName: site.subject ? site.subject : '',
              comments: site.comments ? site.comments : '',
              country: '',
              city: '',
              address: '',
              postCode: '',
              siteCode: '',
              id: site.id
            });
          } else {
            this.dialogRef.close('close');
            this.messageService.show(this.translateService.instant('common.save.notexist.message'), 'error');
          }
        })
    );
  }

  private getSiteDeletionRequest(id: number): void {
    this.isLoading = true;
    this.sub$.add(
      this.siteDeletionRequestService
        .getSiteDeletionRequestById(id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((site: SiteDeletionRequest) => {
          if (site) {
            this.modifyRequestSiteForm.setValue({
              siteName: site.siteCode ? site.siteCode : '',
              comments: site.comments ? site.comments : '',
              country: '',
              city: '',
              address: '',
              postCode: '',
              siteCode: site.siteCode,
              id: site.id
            });
          } else {
            this.dialogRef.close('close');
            this.messageService.show(this.translateService.instant('common.save.notexist.message'), 'error');
          }
        })
    );
  }

  private createSiteModificationRequest(): void {
    this.isLoading = true;
    this.siteModificationRequest = new SiteModificationRequest(
      this.modifyRequestSiteForm.value.id,
      this.modifyRequestSiteForm.value.siteName,
      this.modifyRequestSiteForm.value.comments
    );
    this.sub$.add(
      this.siteModificationRequestService
        .createSiteModificationRequest(this.siteModificationRequest)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(() => {
          this.dialogRef.close('close');
          this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          this.siteModificationRequest = null;
        })
    );
  }

  private createSiteDeletionRequest(): void {
    this.isLoading = true;
    this.siteDeletionRequest = new SiteDeletionRequest(
      this.modifyRequestSiteForm.value.id,
      this.modifyRequestSiteForm.value.siteCode,
      this.modifyRequestSiteForm.value.comments
    );
    this.sub$.add(
      this.siteDeletionRequestService
        .createSiteDeletionRequest(this.siteDeletionRequest)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(() => {
          this.dialogRef.close('close');
          this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          this.siteDeletionRequest = null;
        })
    );
  }

  private siteModificationRequestAndValidation() {
    this.isLoading = true;
    this.siteModificationRequest = new SiteModificationRequest(
      this.modifyRequestSiteForm.value.id,
      this.modifyRequestSiteForm.value.comments
    );
    this.sub$.add(
      this.siteModificationRequestService
        .validateSiteModificationRequest(this.siteModificationRequest)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          this.dialogRef.close('validated');
        })
    );
  }

  private siteDeletionRequestAndValidation() {
    this.isLoading = true;
    this.siteDeletionRequest = new SiteDeletionRequest(
      this.modifyRequestSiteForm.value.id,
      this.modifyRequestSiteForm.value.siteCode,
      this.modifyRequestSiteForm.value.comments
    );
    this.sub$.add(
      this.siteDeletionRequestService
        .validateSiteDeletionRequest(this.siteDeletionRequest)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          this.dialogRef.close('validated');
        })
    );
  }
}
