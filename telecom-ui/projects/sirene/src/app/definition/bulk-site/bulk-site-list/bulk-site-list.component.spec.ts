import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { CompanyService, MessageService, SharedModule, SiteService } from '../../../shared';
import { MockCompanyService } from '../../../shared/services/company/company.service.mock';
import { MockMessageService } from '../../../shared/services/message/message.service.mock';
import { MockSiteService } from '../../../shared/services/site/site.service.mock';
import { BulkSiteListComponent } from './bulk-site-list.component';

class MatDialogRefStub {
  close() {}
}

describe('BulkSiteListComponent', () => {
  let component: BulkSiteListComponent;
  let fixture: ComponentFixture<BulkSiteListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [BulkSiteListComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: CompanyService, useClass: MockCompanyService },
        { provide: SiteService, useClass: MockSiteService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
