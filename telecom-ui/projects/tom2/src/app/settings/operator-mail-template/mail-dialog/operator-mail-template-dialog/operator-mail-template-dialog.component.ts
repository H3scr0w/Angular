import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Networks } from '../../../../shared/models/networks.model';
import { OperatorMailTemplate } from '../../../../shared/models/operator-mail-template.model';
import { MessageService } from '../../../../shared/service/message/message.service';
import { OperatorMailTemplateService } from '../../../../shared/service/operator-mail/operator-mail-template.service';

@Component({
  selector: 'stgo-operator-mail-template-dialog',
  templateUrl: './operator-mail-template-dialog.component.html',
  styleUrls: ['./operator-mail-template-dialog.component.css']
})
export class OperatorMailTemplateDialogComponent implements OnInit, OnDestroy {
  isLoading = false;
  inputNetworks: Subject<string> = new Subject<string>();
  networks: Observable<Networks[]>;
  operatorMailTemplateForm = this.fb.group({
    id: [''],
    networks: [''],
    recipient: [''],
    carbonCopy: [''],
    mailBody: [''],
    objet: [''],
    country: [''],
    date: ['']
  });
  private sub$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OperatorMailTemplateDialogComponent>,
    private messageService: MessageService,
    private translateService: TranslateService,
    private operatorTemplateService: OperatorMailTemplateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.networks = this.inputNetworks.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        return this.operatorTemplateService.getAllNetworks(0, 50, 'name', 'asc', null).pipe(
          switchMap(result => {
            return of(result.content);
          }),
          finalize(() => (this.isLoading = false))
        );
      })
    );

    if (this.data) {
      this.operatorMailTemplateForm.setValue({
        id: this.data.operatorMailTemplate.id || null,
        networks: this.data.operatorMailTemplate.networks || null,
        recipient: this.data.operatorMailTemplate.recipient || null,
        carbonCopy: this.data.operatorMailTemplate.carbonCopy || null,
        mailBody: this.data.operatorMailTemplate.mailBody || null,
        objet: this.data.operatorMailTemplate.objet || null,
        country: this.data.operatorMailTemplate.country || null,
        date: this.data.date || new Date()
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  hasError = (controlName: string, errorName: string) => {
    return this.operatorMailTemplateForm.controls[controlName].hasError(errorName);
  };

  onSubmit(): void {
    if (this.operatorMailTemplateForm.valid) {
      this.isLoading = true;
      const operatorMailTemplate: OperatorMailTemplate = Object.assign({}, this.operatorMailTemplateForm.value);
      operatorMailTemplate.network = operatorMailTemplate.networks.id;
      this.sub$.add(
        this.operatorTemplateService
          .updateMailTemplate(operatorMailTemplate)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          })
      );
    }
  }
}
