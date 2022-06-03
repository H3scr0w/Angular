import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { OperatorParameterService } from '../../../shared/service/operatorparameter/operator-parameter.service';
import { MockOperatorParameterService } from '../../../shared/service/operatorparameter/operator-parameter.service.mock';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { MockOperatorsService } from '../../../shared/service/operators/operators.service.mock';
import { OperatorParameterDialogComponent } from './operator-parameter-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('OperatorParameterDialogComponent', () => {
  let component: OperatorParameterDialogComponent;
  let fixture: ComponentFixture<OperatorParameterDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      declarations: [OperatorParameterDialogComponent],
      providers: [
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: OperatorParameterService, useClass: MockOperatorParameterService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorParameterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
