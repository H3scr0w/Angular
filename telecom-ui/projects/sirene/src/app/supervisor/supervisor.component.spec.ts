import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Directive, Input } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService, SharedModule } from '@shared';
import { MockAuthenticationService } from '../core/authentication/authentication.service.mock';
import { CompanyRequestService } from '../shared/services/company-request/company-request.service';
import { MockCompanyRequestService } from '../shared/services/company-request/company-request.service.mock';
import { ContactService } from '../shared/services/contact/contact.service';
import { MockContactService } from '../shared/services/contact/contact.service.mock';
import { MockMessageService } from '../shared/services/message/message.service.mock';
import { SiteCreationRequestService } from '../shared/services/site-creation-request/site-creation-request.service';
import { MockSiteCreationRequestService } from '../shared/services/site-creation-request/site-creation-request.service.mock';
import { SiteDeletionRequestService } from '../shared/services/site-deletion-request/site-deletion-request.service';
import { MockSiteDeletionRequestService } from '../shared/services/site-deletion-request/site-deletion-request.service.mock';
import { SiteModificationRequestService } from '../shared/services/site-modification-request/site-modification-request.service';
import { MockSiteModificationRequestService } from '../shared/services/site-modification-request/site-modification-request.service.mock';
import { CompanyRequestComponent } from './company-request/company-request.component';
import { SiteRequestComponent } from './site-request/site-request.component';
import { SupervisorComponent } from './supervisor.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[translateParams]'
})
export class TranslateParamsStubDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('translateParams')
  translateParams: any;
}

class MatDialogRefStub {
  close() {}
}

describe('SupervisorComponent', () => {
  let component: SupervisorComponent;
  let fixture: ComponentFixture<SupervisorComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [SupervisorComponent, TranslateParamsStubDirective, CompanyRequestComponent, SiteRequestComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: CompanyRequestService, useClass: MockCompanyRequestService },
        { provide: SiteCreationRequestService, useClass: MockSiteCreationRequestService },
        { provide: SiteDeletionRequestService, useClass: MockSiteDeletionRequestService },
        { provide: SiteModificationRequestService, useClass: MockSiteModificationRequestService },
        { provide: ContactService, useClass: MockContactService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
