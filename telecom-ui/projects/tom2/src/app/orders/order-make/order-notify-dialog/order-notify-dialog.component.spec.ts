import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../shared';
import { CommandService } from '../../../shared/service/commands/command.service';
import { MockCommandService } from '../../../shared/service/commands/command.service.mock';
import { OrderNotifyDialogComponent } from './order-notify-dialog.component';

class MatDialogRefStub {
  close() {}
}

xdescribe('OrderNotifyDialogComponent', () => {
  let component: OrderNotifyDialogComponent;
  let fixture: ComponentFixture<OrderNotifyDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderNotifyDialogComponent],
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        MatDialogModule,
        HttpClientModule,
        QuillModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: CommandService, useClass: MockCommandService },
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
    fixture = TestBed.createComponent(OrderNotifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
