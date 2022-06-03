import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../..';
import { ChargebackService } from '../../../../../../tempo/src/app/shared/service/chargeback/chargeback.service';
import { MockChargebackService } from '../../../../../../tempo/src/app/shared/service/chargeback/chargeback.service.mock';
import { MessageService } from '../../service/message/message.service';
import { MockMessageService } from '../../service/message/message.service.mock';
import { ChargebackAddComponent } from './chargeback-add.component';

class MatDialogRefStub {
  close() {}
}

describe('ChargebackAddComponent', () => {
  let component: ChargebackAddComponent;
  let fixture: ComponentFixture<ChargebackAddComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: ChargebackService, useClass: MockChargebackService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargebackAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
