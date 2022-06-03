import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EmailTemplateModel } from '../../../shared/models/email-template.model';
import { EmailTemplatesService } from '../../../shared/service/email-templates/email-templates.service';
import { MessageService } from '../../../shared/service/message/message.service';

@Component({
  selector: 'stgo-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.css']
})
export class EmailTemplatesComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;
  defaultDate = new Date();
  emailTemplateForm = this.fb.group({
    objetInitial: ['', Validators.required],
    objetRelance: ['', Validators.required],
    mailInitial: ['', Validators.required],
    mailRelance: ['', Validators.required],
    formulaireDateLimiteReponse: ['', Validators.required]
  });
  private sub$: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private emailTemplatesService: EmailTemplatesService,
    private cdref: ChangeDetectorRef
  ) {
    this.getEmailTemplates();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cdref.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.emailTemplateForm.valid) {
      this.isLoading = true;
      const emailTemplate: EmailTemplateModel = new EmailTemplateModel(
        this.emailTemplateForm.controls.objetInitial.value,
        this.emailTemplateForm.controls.objetRelance.value,
        this.emailTemplateForm.controls.mailInitial.value,
        this.emailTemplateForm.controls.mailRelance.value,
        this.emailTemplateForm.controls.formulaireDateLimiteReponse.value
      );
      this.sub$.add(
        this.emailTemplatesService
          .updateEmailTemplate('1', emailTemplate)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res) => {
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          })
      );
    }
  }

  private getEmailTemplates(): void {
    this.isLoading = true;
    this.defaultDate.setDate(this.defaultDate.getDate() + 1);
    this.sub$.add(
      this.emailTemplatesService
        .getEmailTemplateById('1')
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((result) => {
          if (result) {
            if (result.mailInitial) {
              this.emailTemplateForm.controls.mailInitial.setValue(result.mailInitial);
            }
            if (result.mailRelance) {
              this.emailTemplateForm.controls.mailRelance.setValue(result.mailRelance);
            }
            if (result.objetInitial) {
              this.emailTemplateForm.controls.objetInitial.setValue(result.objetInitial);
            }
            if (result.objetRelance) {
              this.emailTemplateForm.controls.objetRelance.setValue(result.objetRelance);
            }
            if (result.formulaireDateLimiteReponse) {
              this.emailTemplateForm.controls.formulaireDateLimiteReponse.setValue(result.formulaireDateLimiteReponse);
            }
            this.cdref.detectChanges();
          }
        })
    );
  }
}
