import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService, SharedModule } from '@shared';
import { MockMessageService } from '../../shared/services/message/message.service.mock';
import { RequestBulkSiteService } from '../../shared/services/request-bulk-site/request-bulk-site.service';
import { MockRequestBulkSiteService } from '../../shared/services/request-bulk-site/request-bulk-site.service.mock';
import { RequestBulkSiteComponent } from './request-bulk-site.component';

describe('RequestBulkSiteComponent', () => {
  let component: RequestBulkSiteComponent;
  let fixture: ComponentFixture<RequestBulkSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: RequestBulkSiteService, useClass: MockRequestBulkSiteService },
        { provide: MessageService, useClass: MockMessageService }
      ],
      declarations: [RequestBulkSiteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestBulkSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
