import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyService, MessageService, SectorService, SharedModule, ZoneService } from '@shared';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { MockCompanyService } from '../../../shared/services/company/company.service.mock';
import { ContactService } from '../../../shared/services/contact/contact.service';
import { MockContactService } from '../../../shared/services/contact/contact.service.mock';
import { MockMessageService } from '../../../shared/services/message/message.service.mock';
import { MockSectorService } from '../../../shared/services/sector/sector.service.mock';
import { MockZoneService } from '../../../shared/services/zone/zone.service.mock';
import { CompanyDialogComponent } from './company-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('CompanyDialogComponent', () => {
  let component: CompanyDialogComponent;
  let fixture: ComponentFixture<CompanyDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: CompanyService, useClass: MockCompanyService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: SectorService, useClass: MockSectorService },
        { provide: ZoneService, useClass: MockZoneService },
        { provide: ContactService, useClass: MockContactService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [CompanyDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
