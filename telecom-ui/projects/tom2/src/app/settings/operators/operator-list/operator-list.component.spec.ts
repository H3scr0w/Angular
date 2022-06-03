import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../../shared';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { MockOperatorsService } from '../../../shared/service/operators/operators.service.mock';
import { OperatorListComponent } from './operator-list.component';

class MatDialogRefStub {
  close() {}
}

describe('OeratorListComponent', () => {
  let component: OperatorListComponent;
  let fixture: ComponentFixture<OperatorListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [OperatorListComponent],
      providers: [
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
