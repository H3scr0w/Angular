import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@shared';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { RequestBulkSiteError } from '../../shared/models/request-bulk-site';
import { RequestBulkSiteService } from '../../shared/services/request-bulk-site/request-bulk-site.service';

@Component({
  selector: 'stgo-request-bulk-site',
  templateUrl: './request-bulk-site.component.html',
  styleUrls: ['./request-bulk-site.component.scss']
})
export class RequestBulkSiteComponent implements OnInit, OnDestroy {
  @ViewChild(FileUploadComponent)
  fileUploadComponent: FileUploadComponent;
  @ViewChild('stepper')
  stepper: MatStepper;
  disabledUpload = true;
  isLoading = false;
  requestBulkSiteErrors: RequestBulkSiteError[];
  fileToUpload: File;
  private sub$: Subscription = new Subscription();

  constructor(
    private requestBulkSiteService: RequestBulkSiteService,
    private messageService: MessageService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  onFileChange(files: File[]) {
    if (files && files.length > 0) {
      this.fileToUpload = files[0];
      this.disabledUpload = false;
      this.requestBulkSiteErrors = null;
    } else {
      this.disabledUpload = true;
    }
  }

  downloadTemplate(): void {
    this.sub$.add(
      this.requestBulkSiteService.downloadTemplate().subscribe(res => {
        const blob = new Blob([res], { type: 'application/octet-stream' });
        saveAs(blob, 'Bulk_site_creation_Template.xlsx');
        this.stepper.next();
      })
    );
  }

  validateAndUpload(): void {
    this.isLoading = true;
    this.sub$.add(
      this.requestBulkSiteService
        .validateAndUpload(this.fileToUpload)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          if (res) {
            this.requestBulkSiteErrors = res;
            if (this.requestBulkSiteErrors.length > 0) {
              this.messageService.show(this.translateService.instant('request.bulkSite.validation.message'), 'error');
            } else {
              this.fileUploadComponent.clearFiles();
              this.disabledUpload = true;
              this.messageService.show(this.translateService.instant('common.upload.success.message'), 'success');
            }
          }
        })
    );
  }
}
