import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Subscription } from 'rxjs/internal/Subscription';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { MessageService } from '../../shared/service/message/message.service';
import { ImportExcelError } from './../../shared/models/import-excel-error';
import { CatalogService } from './../../shared/service/catalog/catalog.service';

@Component({
  selector: 'stgo-catalog-import',
  templateUrl: './catalog-import.component.html',
  styleUrls: ['./catalog-import.component.scss']
})
export class CatalogImportComponent implements OnInit, OnDestroy {
  @ViewChild(FileUploadComponent)
  fileUploadComponent: FileUploadComponent;
  @ViewChild('stepper')
  stepper: MatStepper;
  disabledUpload = true;
  isLoading = false;
  importExcelErrors: ImportExcelError[];
  fileToUpload: File;
  private sub$: Subscription = new Subscription();

  constructor(
    private catalogService: CatalogService,
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
    }
  }

  downloadTemplate(): void {
    this.sub$.add(
      this.catalogService.downloadTemplate().subscribe(res => {
        const blob = new Blob([res], { type: 'application/octet-stream' });
        saveAs(blob, 'CATALOG_TEMPLATE_FILE.xls');
        this.stepper.next();
      })
    );
  }

  validateAndUpload(): void {
    this.isLoading = true;
    this.sub$.add(
      this.catalogService
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
