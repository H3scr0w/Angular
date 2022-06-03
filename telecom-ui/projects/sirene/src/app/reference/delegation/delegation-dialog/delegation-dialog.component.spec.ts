import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { DelegationService, MessageService, SharedModule } from '@shared';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { MockDelegationService } from '../../../shared/services/delegation/delegation.service.mock';
import { MockMessageService } from '../../../shared/services/message/message.service.mock';
import { DelegationDialogComponent } from './delegation-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('DelegationDialogComponent', () => {
  let component: DelegationDialogComponent;
  let fixture: ComponentFixture<DelegationDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: DelegationService, useClass: MockDelegationService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [DelegationDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
