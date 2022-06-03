import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../../shared';
import { CsvParameterService } from '../../../shared/service/csvparameter/csv-parameter.service';
import { MockCsvParameterService } from '../../../shared/service/csvparameter/csv-parameter.service.mock';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { MockOperatorsService } from '../../../shared/service/operators/operators.service.mock';
import { ExportTemplateListComponent } from './export-template-list.component';

class MatDialogRefStub {
  close() {}
}

describe('ExportTemplateListComponent', () => {
  let component: ExportTemplateListComponent;
  let fixture: ComponentFixture<ExportTemplateListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [ExportTemplateListComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: CsvParameterService, useClass: MockCsvParameterService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
