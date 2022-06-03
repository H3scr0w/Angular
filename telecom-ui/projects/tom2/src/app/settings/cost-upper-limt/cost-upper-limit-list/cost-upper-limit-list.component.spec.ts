import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { CostUpperLimitService } from '../../../shared/service/cost-upper-limit/cost-upper-limit.service';
import { CostUpperLimitServiceMock } from '../../../shared/service/cost-upper-limit/cost-upper-limit.service.mock';
import { CostUpperLimitListComponent } from './cost-upper-limit-list.component';

class MatDialogRefStub {
  close() {}
}

describe('CostUpperLimitListComponent', () => {
  let component: CostUpperLimitListComponent;
  let fixture: ComponentFixture<CostUpperLimitListComponent>;

  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot(), MatDialogModule],
      declarations: [CostUpperLimitListComponent],
      providers: [
        { provide: CostUpperLimitService, useClass: CostUpperLimitServiceMock },
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
    fixture = TestBed.createComponent(CostUpperLimitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
