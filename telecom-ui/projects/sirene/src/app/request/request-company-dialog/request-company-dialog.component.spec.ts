import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyService, MessageService, SectorService, SharedModule, ZoneService } from '@shared';
import { CompanyRequestService } from '../../shared/services/company-request/company-request.service';
import { MockCompanyRequestService } from '../../shared/services/company-request/company-request.service.mock';
import { MockCompanyService } from '../../shared/services/company/company.service.mock';
import { ContactService } from '../../shared/services/contact/contact.service';
import { MockContactService } from '../../shared/services/contact/contact.service.mock';
import { MockMessageService } from '../../shared/services/message/message.service.mock';
import { MockSectorService } from '../../shared/services/sector/sector.service.mock';
import { MockZoneService } from '../../shared/services/zone/zone.service.mock';
import { RequestCompanyDialogComponent } from './request-company-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('RequestCompanyDialogComponent', () => {
  let component: RequestCompanyDialogComponent;
  let fixture: ComponentFixture<RequestCompanyDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: SectorService, useClass: MockSectorService },
        { provide: ZoneService, useClass: MockZoneService },
        { provide: CompanyService, useClass: MockCompanyService },
        { provide: CompanyRequestService, useClass: MockCompanyRequestService },
        { provide: ContactService, useClass: MockContactService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [RequestCompanyDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCompanyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
