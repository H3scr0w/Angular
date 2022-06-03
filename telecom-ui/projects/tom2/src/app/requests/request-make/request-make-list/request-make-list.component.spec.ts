import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { RequestService } from '../../../shared/service/request/request.service';
import { MockRequestService } from '../../../shared/service/request/request.service.mock';
import { SharedModule } from '../../../shared/shared.module';
import { RequestTerminationComponent } from '../../request-termination/request-termination.component';
import { RequestMakeListComponent } from './request-make-list.component';

class MatDialogRefStub {
  close() {}
}

describe('RequestMakeListComponent', () => {
  let component: RequestMakeListComponent;
  let fixture: ComponentFixture<RequestMakeListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        BrowserDynamicTestingModule
      ],
      providers: [
        { provide: RequestService, useClass: MockRequestService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialog, useValue: matDialogRefStub }
      ],
      declarations: [RequestMakeListComponent, RequestTerminationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMakeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
