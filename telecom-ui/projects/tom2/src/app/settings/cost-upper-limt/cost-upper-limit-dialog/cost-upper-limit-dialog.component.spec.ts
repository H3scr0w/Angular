import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { CostUpperLimitService } from '../../../shared/service/cost-upper-limit/cost-upper-limit.service';
import { CostUpperLimitServiceMock } from '../../../shared/service/cost-upper-limit/cost-upper-limit.service.mock';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { CostUpperLimitDialogComponent } from './cost-upper-limit-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('CostUpperLimitDialogComponent', () => {
  let component: CostUpperLimitDialogComponent;
  let fixture: ComponentFixture<CostUpperLimitDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot(), HttpClientModule, MatDialogModule],
      providers: [
        { provide: CostUpperLimitService, useClass: CostUpperLimitServiceMock },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [CostUpperLimitDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostUpperLimitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
