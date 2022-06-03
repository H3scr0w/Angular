import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../../shared';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { OperatorParameterService } from '../../../shared/service/operatorparameter/operator-parameter.service';
import { MockOperatorParameterService } from '../../../shared/service/operatorparameter/operator-parameter.service.mock';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { MockOperatorsService } from '../../../shared/service/operators/operators.service.mock';
import { OperatorParameterListComponent } from './operator-parameter-list.component';

class MatDialogRefStub {
  close() {}
}

describe('OperatorParameterListComponent', () => {
  let component: OperatorParameterListComponent;
  let fixture: ComponentFixture<OperatorParameterListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [OperatorParameterListComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: OperatorParameterService, useClass: MockOperatorParameterService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorParameterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
