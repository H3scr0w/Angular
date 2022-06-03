import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { CityService, CountryService, MessageService, SharedModule } from '@shared';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { MockCityService } from '../../../shared/services/city/city.service.mock';
import { MockCountryService } from '../../../shared/services/country/country.service.mock';
import { MockMessageService } from '../../../shared/services/message/message.service.mock';
import { CityDialogComponent } from './city-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('CityDialogComponent', () => {
  let component: CityDialogComponent;
  let fixture: ComponentFixture<CityDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: CityService, useClass: MockCityService },
        { provide: CountryService, useClass: MockCountryService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [CityDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
