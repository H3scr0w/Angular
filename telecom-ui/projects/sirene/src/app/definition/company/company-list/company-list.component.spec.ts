import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyService, MessageService, SectorService, SharedModule, ZoneService } from '@shared';
import { of } from 'rxjs';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { MockCompanyService } from '../../../shared/services/company/company.service.mock';
import { MockMessageService } from '../../../shared/services/message/message.service.mock';
import { MockSectorService } from '../../../shared/services/sector/sector.service.mock';
import { MockZoneService } from '../../../shared/services/zone/zone.service.mock';
import { CompanyListComponent } from './company-list.component';
class MatDialogRefStub {
  close() {}
}

describe('CompanyListComponent', () => {
  let component: CompanyListComponent;
  let fixture: ComponentFixture<CompanyListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: CompanyService, useClass: MockCompanyService },
        { provide: SectorService, useClass: MockSectorService },
        { provide: ZoneService, useClass: MockZoneService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (sifCode: string) => 'ADP001' })
          }
        }
      ],
      declarations: [CompanyListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
