import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ImportExcelError } from '../../shared/models/import-excel-error';
import { MessageService } from '../../shared/service/message/message.service';
import { RequestService } from '../../shared/service/request/request.service';

@Component({
  selector: 'stgo-bulk-operator-response',
  templateUrl: './bulk-operator-response.component.html',
  styleUrls: ['./bulk-operator-response.component.css']
})
export class BulkOperatorResponseComponent implements OnInit, OnDestroy {
  @ViewChild(FileUploadComponent)
  fileUploadComponent: FileUploadComponent;
  disabledUpload = true;
  isLoading = false;
  importExcelErrors: ImportExcelError[];
  fileToUpload: File;

  private sub$: Subscription = new Subscription();

  constructor(
    private requestService: RequestService,
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
      this.importExcelErrors = null;
    } else {
      this.disabledUpload = true;
      this.importExcelErrors = null;
    }
  }

  validateAndUpload(): void {
    this.isLoading = true;
    this.sub$.add(
      this.requestService
        .validateAndUpload(this.fileToUpload)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          if (res) {
            this.importExcelErrors = res;
            if (this.importExcelErrors.length > 0) {
              this.messageService.show(this.translateService.instant('catalog.import.validation.message'), 'error');
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
