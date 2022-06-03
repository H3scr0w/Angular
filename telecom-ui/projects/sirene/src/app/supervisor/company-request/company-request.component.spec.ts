import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService, SharedModule } from '@shared';
import { MockAuthenticationService } from '../../core/authentication/authentication.service.mock';
import { CompanyRequestService } from '../../shared/services/company-request/company-request.service';
import { MockCompanyRequestService } from '../../shared/services/company-request/company-request.service.mock';
import { MockMessageService } from '../../shared/services/message/message.service.mock';
import { CompanyRequestComponent } from './company-request.component';

class MatDialogRefStub {
  close() {}
}

describe('CompanyRequestComponent', () => {
  let component: CompanyRequestComponent;
  let fixture: ComponentFixture<CompanyRequestComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: CompanyRequestService, useClass: MockCompanyRequestService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        MatSnackBar
      ],
      declarations: [CompanyRequestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
