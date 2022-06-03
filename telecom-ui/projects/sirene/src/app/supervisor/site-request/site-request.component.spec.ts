import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService, SharedModule } from '@shared';
import { MockAuthenticationService } from '../../core/authentication/authentication.service.mock';
import { MockMessageService } from '../../shared/services/message/message.service.mock';
import { SiteCreationRequestService } from '../../shared/services/site-creation-request/site-creation-request.service';
import { MockSiteCreationRequestService } from '../../shared/services/site-creation-request/site-creation-request.service.mock';
import { SiteDeletionRequestService } from '../../shared/services/site-deletion-request/site-deletion-request.service';
import { MockSiteDeletionRequestService } from '../../shared/services/site-deletion-request/site-deletion-request.service.mock';
import { SiteModificationRequestService } from '../../shared/services/site-modification-request/site-modification-request.service';
import { MockSiteModificationRequestService } from '../../shared/services/site-modification-request/site-modification-request.service.mock';
import { SiteRequestComponent } from './site-request.component';

class MatDialogRefStub {
  close() {}
}

describe('SiteRequestComponent', () => {
  let component: SiteRequestComponent;
  let fixture: ComponentFixture<SiteRequestComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: SiteCreationRequestService, useClass: MockSiteCreationRequestService },
        { provide: SiteDeletionRequestService, useClass: MockSiteDeletionRequestService },
        { provide: SiteModificationRequestService, useClass: MockSiteModificationRequestService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        MatSnackBar
      ],
      declarations: [SiteRequestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
