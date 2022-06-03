import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../../shared';
import { CommandService } from '../../../shared/service/commands/command.service';
import { MockCommandService } from '../../../shared/service/commands/command.service.mock';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { OperatorMailTemplateService } from '../../../shared/service/operator-mail/operator-mail-template.service';
import { MockOperatorMailTemplateService } from '../../../shared/service/operator-mail/operator-mail-template.service.mock';
import { RequestService } from '../../../shared/service/request/request.service';
import { MockRequestService } from '../../../shared/service/request/request.service.mock';
import { CancellationOrderDialogComponent } from './cancellation-order-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('CancellationOrderDialogComponent', () => {
  let component: CancellationOrderDialogComponent;
  let fixture: ComponentFixture<CancellationOrderDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      declarations: [CancellationOrderDialogComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: RequestService, useClass: MockRequestService },
        { provide: CommandService, useClass: MockCommandService },
        { provide: OperatorMailTemplateService, useClass: MockOperatorMailTemplateService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
