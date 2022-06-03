import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../../shared';
import { CatalogService } from '../../../shared/service/catalog/catalog.service';
import { MockCatalogService } from '../../../shared/service/catalog/catalog.service.mock';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { MockOperatorsService } from '../../../shared/service/operators/operators.service.mock';

import { LtcTerminationService } from '../../../shared/service/ltc-termination/ltc-termination.service';
import { MockLtcTerminationService } from '../../../shared/service/ltc-termination/ltc-termination.service.mock';
import { LtcTerminationListComponent } from './ltc-termination-list.component';

class MatDialogRefStub {
  close() {}
}

describe('LtcTerminationListComponent', () => {
  let component: LtcTerminationListComponent;
  let fixture: ComponentFixture<LtcTerminationListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: CatalogService, useClass: MockCatalogService },
        { provide: LtcTerminationService, useClass: MockLtcTerminationService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA }
      ],
      declarations: [LtcTerminationListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LtcTerminationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
