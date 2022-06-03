import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DelegationService, SharedModule } from '@shared';
import { MockDelegationService } from '../../../shared/services/delegation/delegation.service.mock';
import { DelegationListComponent } from './delegation-list.component';

class MatDialogRefStub {
  close() {}
}

describe('DelegationListComponent', () => {
  let component: DelegationListComponent;
  let fixture: ComponentFixture<DelegationListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [DelegationListComponent],
      providers: [
        { provide: DelegationService, useClass: MockDelegationService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
