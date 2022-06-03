import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared';
import { MessageService } from '../../shared/service/message/message.service';
import { MockMessageService } from '../../shared/service/message/message.service.mock';
import { RequestService } from '../../shared/service/request/request.service';
import { MockRequestService } from '../../shared/service/request/request.service.mock';
import { BulkOperatorResponseComponent } from './bulk-operator-response.component';

describe('BulkOperatorResponseComponent', () => {
  let component: BulkOperatorResponseComponent;
  let fixture: ComponentFixture<BulkOperatorResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: RequestService, useClass: MockRequestService },
        { provide: MessageService, useClass: MockMessageService }
      ],
      declarations: [BulkOperatorResponseComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(BulkOperatorResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
