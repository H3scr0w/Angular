import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../../shared';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { RequestService } from '../../../shared/service/request/request.service';
import { MockRequestService } from '../../../shared/service/request/request.service.mock';
import { CancellationFolloupListComponent } from './cancellation-folloup-list.component';

class MatDialogRefStub {
  close() {}
}

describe('CancellationFolloupListComponent', () => {
  let component: CancellationFolloupListComponent;
  let fixture: ComponentFixture<CancellationFolloupListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [CancellationFolloupListComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: RequestService, useClass: MockRequestService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationFolloupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
