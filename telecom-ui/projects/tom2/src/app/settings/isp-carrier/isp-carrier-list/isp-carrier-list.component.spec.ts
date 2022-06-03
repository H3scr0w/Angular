import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../../shared';
import { IspCarrierService } from '../../../shared/service/isp-carrier/isp-carrier.service';
import { MockIspCarrierService } from '../../../shared/service/isp-carrier/isp-carrier.service.mock';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { IspCarrierListComponent } from './isp-carrier-list.component';

class MatDialogRefStub {
  close() {}
}

describe('IspCarrierListComponent', () => {
  let component: IspCarrierListComponent;
  let fixture: ComponentFixture<IspCarrierListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [IspCarrierListComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: IspCarrierService, useClass: MockIspCarrierService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IspCarrierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
