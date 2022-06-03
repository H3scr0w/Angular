import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CountryService, DelegationService, MessageService, SharedModule } from '@shared';
import { MockCountryService } from '../../../shared/services/country/country.service.mock';
import { MockDelegationService } from '../../../shared/services/delegation/delegation.service.mock';
import { MockMessageService } from '../../../shared/services/message/message.service.mock';
import { CountryDialogComponent } from './country-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('CountryDialogComponent', () => {
  let component: CountryDialogComponent;
  let fixture: ComponentFixture<CountryDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: CountryService, useClass: MockCountryService },
        { provide: DelegationService, useClass: MockDelegationService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [CountryDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
