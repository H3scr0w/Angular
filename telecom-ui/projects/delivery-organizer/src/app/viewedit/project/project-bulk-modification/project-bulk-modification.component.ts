import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { MessageService } from '../../../shared/message/message.service';
import { BulkUploadError } from '../../../shared/models/bulk-upload-error';
import { DeploymentService } from '../../../shared/services/deploymet/deployment.service';

@Component({
  selector: 'stgo-project-bulk-modification',
  templateUrl: './project-bulk-modification.component.html',
  styleUrls: ['./project-bulk-modification.component.scss']
})
export class ProjectBulkModificationComponent implements OnInit, OnDestroy {
  @ViewChild(FileUploadComponent)
  fileUploadComponent: FileUploadComponent;
  @ViewChild('stepper')
  stepper: MatStepper;
  disabledUpload = true;
  isLoading = false;
  projectModesBulkUploadErrors : BulkUploadError[];
  fileToUpload: File;

  private sub$: Subscription = new Subscription();

  constructor(
    private deploymentService : DeploymentService,
    private messageService: MessageService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  onFileChange(files: File[]) {
    if (files && files.length > 0) {
      this.fileToUpload = files[0];
      this.disabledUpload = false;
      this.projectModesBulkUploadErrors = null;
    } else {
      this.disabledUpload = true;
    }
  }

  validateAndUpload(): void {
    this.isLoading = true;
    this.sub$.add(
      this.deploymentService
        .validateAndUpload(this.fileToUpload)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          if (res) {
            this.projectModesBulkUploadErrors = res;
            if (this.projectModesBulkUploadErrors.length > 0) {
              this.messageService.show(this.translateService.instant('bulkUpload.validation.message'), 'error');
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
