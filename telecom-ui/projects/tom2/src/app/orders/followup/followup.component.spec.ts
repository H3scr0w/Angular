import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { CompanyService, SectorService, ZoneService } from '../../../../../sirene/src/app/shared';
import { MockCompanyService } from '../../../../../sirene/src/app/shared/services/company/company.service.mock';
import { ContactService } from '../../../../../sirene/src/app/shared/services/contact/contact.service';
import { MockContactService } from '../../../../../sirene/src/app/shared/services/contact/contact.service.mock';
import { MockSectorService } from '../../../../../sirene/src/app/shared/services/sector/sector.service.mock';
import { MockZoneService } from '../../../../../sirene/src/app/shared/services/zone/zone.service.mock';

import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationService } from '../../core';
import { MockAuthenticationService } from '../../core/authentication/authentication.service.mock';
import { CommandService } from '../../shared/service/commands/command.service';
import { MockCommandService } from '../../shared/service/commands/command.service.mock';
import { MessageService } from '../../shared/service/message/message.service';
import { MockMessageService } from '../../shared/service/message/message.service.mock';
import { OperatorsService } from '../../shared/service/operators/operators.service';
import { MockOperatorsService } from '../../shared/service/operators/operators.service.mock';
import { QueuesService } from '../../shared/service/queues/queues.service';
import { MockQueuesService } from '../../shared/service/queues/queues.service.mock';
import { FollowupComponent } from './followup.component';

class MatDialogRefStub {
  close() {}
}

describe('FollowupComponent', () => {
  let component: FollowupComponent;
  let fixture: ComponentFixture<FollowupComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [FollowupComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: CommandService, useClass: MockCommandService },
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: QueuesService, useClass: MockQueuesService },
        { provide: SectorService, useClass: MockSectorService },
        { provide: ZoneService, useClass: MockZoneService },
        { provide: CompanyService, useClass: MockCompanyService },
        { provide: ContactService, useClass: MockContactService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (orderID: string) => 'ZA0044-D0-S1-01' })
          }
        },
        { provide: MAT_DIALOG_DATA }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
