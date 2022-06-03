import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { MessageService } from '../../../../shared/service/message/message.service';
import { MockMessageService } from '../../../../shared/service/message/message.service.mock';
import { OperatorMailTemplateService } from '../../../../shared/service/operator-mail/operator-mail-template.service';
import { MockOperatorMailTemplateService } from '../../../../shared/service/operator-mail/operator-mail-template.service.mock';
import { OperatorMailTemplateDialogComponent } from './operator-mail-template-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('OperatorMailTemplateDialogComponent', () => {
  let component: OperatorMailTemplateDialogComponent;
  let fixture: ComponentFixture<OperatorMailTemplateDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot(), HttpClientModule, MatDialogModule],
      providers: [
        { provide: OperatorMailTemplateService, useClass: MockOperatorMailTemplateService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [OperatorMailTemplateDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorMailTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
