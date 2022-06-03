import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@shared';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { PopItem } from '../../../shared/models/popitem.model';
import { Segmentation } from '../../../shared/models/segmentation.model';
import { SegmentationService } from '../../../shared/services/segmentation/segmentation.service';
import { SegmentationDialogData } from './segmentation-dialog-data';

@Component({
  selector: 'stgo-segmentation-dialog',
  templateUrl: './segmentation-dialog.component.html',
  styleUrls: ['./segmentation-dialog.component.css']
})
export class SegmentationDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  segmentations: Observable<Segmentation[]>;
  popItems: Observable<PopItem[]>;
  segmentationId: number;
  inputSegmentation: Subject<string> = new Subject<string>();
  segmentationForm = this.fb.group({
    name: ['', Validators.required],
    paloZoneName: ['', Validators.required],
    popItems: ['', Validators.required],
    comments: ['']
  });
  private sub$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private segmentationService: SegmentationService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<SegmentationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SegmentationDialogData
  ) {}

  ngOnInit() {
    this.popItems = this.inputSegmentation.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.segmentationService.getPopItems().pipe(
          switchMap(result => {
            return of(result);
          })
        );
      })
    );

    if (this.data) {
      this.segmentationForm.setValue({
        name: this.data.segmentation.name,
        paloZoneName: this.data.segmentation.paloZoneName || null,
        popItems: this.data.segmentation.popItems || null,
        comments: this.data.segmentation.comments || null
      });
      if (this.data.mode === 'edit') {
        this.segmentationId = this.data.segmentation.id;
      }
      if (this.data.mode === 'add') {
        this.segmentationForm.get('popItems').setValue(null);
      }
    }
  }

  onCloseClick(): void {
    this.dialogRef.close('close');
  }

  hasError = (controlName: string, errorName: string) => {
    return this.segmentationForm.controls[controlName].hasError(errorName);
  };

  onSubmit(): void {
    if (this.segmentationForm.valid) {
      this.isLoading = true;
      const segmentation: Segmentation = Object.assign({}, this.segmentationForm.value);

      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.segmentationService
            .addSegmentation(segmentation)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      } else {
        segmentation.id = this.segmentationId;
        this.sub$.add(
          this.segmentationService
            .editSegmentation(segmentation)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }
}
