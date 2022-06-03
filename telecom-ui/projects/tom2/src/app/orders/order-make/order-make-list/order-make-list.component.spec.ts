import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { OrderMakeListComponent } from './order-make-list.component';

class MatDialogRefStub {
  close() {}
}

describe('OrderMakeListComponent', () => {
  let component: OrderMakeListComponent;
  let fixture: ComponentFixture<OrderMakeListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderMakeListComponent],
      imports: [BrowserAnimationsModule, SharedModule, HttpClientModule, TranslateModule.forRoot()],
      providers: [
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialog, useValue: matDialogRefStub },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMakeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
