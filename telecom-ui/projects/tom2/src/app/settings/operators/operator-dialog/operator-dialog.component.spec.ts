import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared';
import { CsvParameterService } from '../../../shared/service/csvparameter/csv-parameter.service';
import { MockCsvParameterService } from '../../../shared/service/csvparameter/csv-parameter.service.mock';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { MockOperatorsService } from '../../../shared/service/operators/operators.service.mock';
import { OperatorDialogComponent } from './operator-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('OperatorDialogComponent', () => {
  let component: OperatorDialogComponent;
  let fixture: ComponentFixture<OperatorDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      declarations: [OperatorDialogComponent],
      providers: [
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: CsvParameterService, useClass: MockCsvParameterService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
