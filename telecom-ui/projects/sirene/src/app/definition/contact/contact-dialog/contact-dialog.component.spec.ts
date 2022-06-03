import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService, SharedModule } from '@shared';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { CountryService } from '../../../shared';
import { ContactService } from '../../../shared/services/contact/contact.service';
import { MockContactService } from '../../../shared/services/contact/contact.service.mock';
import { MockCountryService } from '../../../shared/services/country/country.service.mock';
import { MockMessageService } from '../../../shared/services/message/message.service.mock';
import { ProfileService } from '../../../shared/services/profile/profile.service';
import { MockProfileService } from '../../../shared/services/profile/profile.service.mock';
import { ContactDialogComponent } from './contact-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('ContactDialogComponent', () => {
  let component: ContactDialogComponent;
  let fixture: ComponentFixture<ContactDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: ContactService, useClass: MockContactService },
        { provide: ProfileService, useClass: MockProfileService },
        { provide: CountryService, useClass: MockCountryService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [ContactDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
