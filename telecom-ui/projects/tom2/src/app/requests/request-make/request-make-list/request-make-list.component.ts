import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { RequestType } from '../../../shared/enums/enum';
import { IdName } from '../../../shared/models/id-name';
import { Request } from '../../../shared/models/request';
import { TelecomService } from '../../../shared/models/telecom-service-selector';
import { MessageService } from '../../../shared/service/message/message.service';
import { RequestService } from '../../../shared/service/request/request.service';
import { RequestResultDialogData } from '../request-make-dialog/request-make-dialog-data';
import { RequestMakeDialogComponent } from '../request-make-dialog/request-make-dialog.component';

@Component({
  selector: 'stgo-request-make-list',
  templateUrl: './request-make-list.component.html',
  styleUrls: ['./request-make-list.component.css']
})
export class RequestMakeListComponent implements OnInit {
  requestTypes: IdName[];
  isLoading = false;
  isTermination = false;

  @ViewChild('stepper') stepper: MatStepper;

  requestTypeForm = this.fb.group({
    requestType: ['', Validators.required]
  });

  requestCancellationForm = this.fb.group({
    sgtSiteCode: [''],
    orderId: ['']
  });

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private requestService: RequestService,
    private messageService: MessageService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.requestTypes = this.requestService.getRequestTypes();
    this.requestTypeForm.controls.requestType.setValue(null);
  }

  onServiceSelected(service: TelecomService): void {
    const dialogRef = this.dialog.open(RequestMakeDialogComponent, {
      width: '1000px',
      data: { mode: 'add', requestType: this.requestTypeForm.get('requestType').value, telecomService: service },
      disableClose: true,
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close' && result) {
        const requestResultDialogData: RequestResultDialogData = result;
        const request: Request = requestResultDialogData.request;
        if (request && request.id) {
          if (requestResultDialogData.isAnyError) {
            this.messageService.showWithAction(
              this.translateService.instant('request.make.success.partially.message', { requestId: request.id })
            );
          } else {
            this.messageService.showWithAction(
              this.translateService.instant('request.make.success.message', { requestId: request.id })
            );
          }
        }
      }
    });
  }

  disableInput(getControl: string): void {
    if (getControl === 'sgtSiteCode') {
      this.requestCancellationForm.get('sgtSiteCode').setValue(null);
    } else {
      this.requestCancellationForm.get('orderId').setValue(null);
    }
  }

  getStep(): void {
    if (this.requestTypeForm.get('requestType').value === RequestType.Termination) {
      this.isTermination = true;
    } else {
      this.isTermination = false;
    }
  }
}
