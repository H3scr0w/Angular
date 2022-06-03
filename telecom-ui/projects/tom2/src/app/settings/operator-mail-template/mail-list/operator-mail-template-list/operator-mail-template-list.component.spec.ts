import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { MockAuthenticationService } from '../../../../core/authentication/authentication.service.mock';
import { OperatorMailTemplateService } from '../../../../shared/service/operator-mail/operator-mail-template.service';
import { MockOperatorMailTemplateService } from '../../../../shared/service/operator-mail/operator-mail-template.service.mock';
import { OperatorMailTemplateListComponent } from './operator-mail-template-list.component';

class MatDialogRefStub {
  close() {}
}

describe('OperatorMailTemplateListComponent', () => {
  let component: OperatorMailTemplateListComponent;
  let fixture: ComponentFixture<OperatorMailTemplateListComponent>;

  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot(), MatDialogModule],
      declarations: [OperatorMailTemplateListComponent],
      providers: [
        { provide: OperatorMailTemplateService, useClass: MockOperatorMailTemplateService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorMailTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
