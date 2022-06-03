import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Chargeback } from '../../../../../../tempo/src/app/shared/models/chargeback';
import { ChargebackService } from '../../../../../../tempo/src/app/shared/service/chargeback/chargeback.service';
import { MessageService } from '../../service/message/message.service';

@Component({
  selector: 'stgo-chargeback-add',
  templateUrl: './chargeback-add.component.html',
  styleUrls: ['./chargeback-add.component.css']
})
export class ChargebackAddComponent implements OnInit, OnDestroy {
  chargebackAddForm = this.fb.group({
    label: [''],
    sapAccount: [''],
    sif: ['']
  });
  private sub$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private chargebackService: ChargebackService,
    public dialogRef: MatDialogRef<ChargebackAddComponent>,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  addChargeback(): void {
    if (this.chargebackAddForm.valid) {
      let chargeback: Chargeback;
      chargeback = this.chargebackAddForm.value;
      chargeback.display = 1;
      this.chargebackService.url = '/tempo/chargebacks';

      this.sub$.add(
        this.chargebackService.addChargeback(chargeback).subscribe(res => {
          this.dialogRef.close(res);
          this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
        })
      );
    }
  }
}
