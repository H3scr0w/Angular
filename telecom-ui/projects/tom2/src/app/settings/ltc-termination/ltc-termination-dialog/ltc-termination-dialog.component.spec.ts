import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { MockOperatorsService } from '../../../shared/service/operators/operators.service.mock';

import { CatalogService } from '../../../shared/service/catalog/catalog.service';
import { MockCatalogService } from '../../../shared/service/catalog/catalog.service.mock';
import { LtcTerminationService } from '../../../shared/service/ltc-termination/ltc-termination.service';
import { MockLtcTerminationService } from '../../../shared/service/ltc-termination/ltc-termination.service.mock';
import { LtcTerminationDialogComponent } from './ltc-termination-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('LtcTerminationDialogComponent', () => {
  let component: LtcTerminationDialogComponent;
  let fixture: ComponentFixture<LtcTerminationDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: CatalogService, useClass: MockCatalogService },
        { provide: LtcTerminationService, useClass: MockLtcTerminationService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA }
      ],
      declarations: [LtcTerminationDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LtcTerminationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
