import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared';
import { IspCarrierService } from '../../../shared/service/isp-carrier/isp-carrier.service';
import { MockIspCarrierService } from '../../../shared/service/isp-carrier/isp-carrier.service.mock';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { IspCarrierDialogComponent } from './isp-carrier-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('IspCarrierDialogComponent', () => {
  let component: IspCarrierDialogComponent;
  let fixture: ComponentFixture<IspCarrierDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      declarations: [IspCarrierDialogComponent],
      providers: [
        { provide: IspCarrierService, useClass: MockIspCarrierService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IspCarrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
