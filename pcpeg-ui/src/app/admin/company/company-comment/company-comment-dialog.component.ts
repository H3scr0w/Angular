import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CompanyModel } from 'src/app/shared/models/company.model';
import { CompanyService } from 'src/app/shared/service/company/company.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { CompanyCommentDialogData } from './company-comment-dialog-data';

@Component({
  selector: 'stgo-contract-dialog',
  templateUrl: './company-comment-dialog.component.html',
  styleUrls: ['./company-comment-dialog.component.scss']
})
export class CompanyCommentDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  company: CompanyModel;
  private sub$: Subscription = new Subscription();

  commentForm = this.fb.group({
    comment: ['']
  });

  constructor(
    private companyService: CompanyService,
    private translateService: TranslateService,
    private messageService: MessageService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CompanyCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyCommentDialogData
  ) {}

  ngOnInit(): void {
    this.commentForm.patchValue({
      comment: !this.data.company.comments ? null : this.data.company.comments
    });
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      this.isLoading = true;
      this.data.company.comments = this.commentForm.controls.comment.value;
      if (this.data) {
        this.sub$.add(
          this.companyService
            .addComment(this.data.company)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('company.save.success.message'), 'success');
            })
        );
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  hasError = (controlName: string, errorName: string) => {
    if (this.data) {
      return this.commentForm.controls[controlName].hasError(errorName);
    }
    return this.commentForm.controls[controlName].hasError(errorName) && this.commentForm.controls[controlName].touched;
  }
}
