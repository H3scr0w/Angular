import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../shared';
import { CommandService } from '../../shared/service/commands/command.service';
import { MockCommandService } from '../../shared/service/commands/command.service.mock';
import { MessageService } from '../../shared/service/message/message.service';
import { MockMessageService } from '../../shared/service/message/message.service.mock';
import { RequestService } from '../../shared/service/request/request.service';
import { MockRequestService } from '../../shared/service/request/request.service.mock';
import { EmailPreviewDialogComponent } from './email-preview-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('EmailPreviewDialogComponent', () => {
  let component: EmailPreviewDialogComponent;
  let fixture: ComponentFixture<EmailPreviewDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        MatDialogModule,
        HttpClientModule,
        QuillModule,
        TranslateModule.forRoot()
      ],
      declarations: [EmailPreviewDialogComponent],
      providers: [
        { provide: CommandService, useClass: MockCommandService },
        { provide: RequestService, useClass: MockRequestService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        QuillModule.forRoot({
          bounds: 'body',
          debug: false,
          format: 'object',
          formats: ['bold'],
          modules: {
            toolbar: {
              container: [['bold', 'italic', 'underline'], [{ color: [] }]]
            }
          },
          placeholder: 'placeholder',
          readOnly: true,
          scrollingContainer: null,
          theme: 'snow',
          trackChanges: 'all'
        }).providers
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPreviewDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
