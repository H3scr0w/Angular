import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyService, MessageService, SharedModule, SiteService } from '../../../shared';
import { MockCompanyService } from '../../../shared/services/company/company.service.mock';
import { MockMessageService } from '../../../shared/services/message/message.service.mock';
import { MockSiteService } from '../../../shared/services/site/site.service.mock';
import { BulkSiteDialogComponent } from './bulk-site-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('BulkSiteDialogComponent', () => {
  let component: BulkSiteDialogComponent;
  let fixture: ComponentFixture<BulkSiteDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      declarations: [BulkSiteDialogComponent],
      providers: [
        { provide: CompanyService, useClass: MockCompanyService },
        { provide: SiteService, useClass: MockSiteService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
