import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MultiEmailPreviewDialogComponent } from './multi-email-preview-dialog.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { QuillModule } from 'ngx-quill';
import { CommandService } from '../../shared/service/commands/command.service';
import { MockCommandService } from '../../shared/service/commands/command.service.mock';
import { RequestService } from '../../shared/service/request/request.service';
import { MockRequestService } from '../../shared/service/request/request.service.mock';
import { EmailPreviewDialogComponent } from '../email-preview-dialog/email-preview-dialog.component';

class MatDialogRefStub {
  close() {}
}

fdescribe('MultiEmailPreviewDialogComponent', () => {
  let component: MultiEmailPreviewDialogComponent;
  let fixture: ComponentFixture<MultiEmailPreviewDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        MatProgressBarModule,
        MatDialogModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatChipsModule,
        MatIconModule,
        QuillModule,
        TranslateModule.forRoot()
      ],
      declarations: [MultiEmailPreviewDialogComponent, EmailPreviewDialogComponent],
      providers: [
        { provide: CommandService, useClass: MockCommandService },
        { provide: RequestService, useClass: MockRequestService },
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
    fixture = TestBed.createComponent(MultiEmailPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
