import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { CompanyListComponent } from './company-list.component';

class MatDialogRefStub {
  close(): void {}
}

describe('CompanyListComponent', () => {
  let component: CompanyListComponent;
  let fixture: ComponentFixture<CompanyListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatDialogModule, SharedModule, TranslateModule.forRoot(), HttpClientModule],
      providers: [
        MatSnackBar,
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        { provide: AuthenticationService, useClass: MockAuthenticationService }
      ],
      declarations: [CompanyListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
