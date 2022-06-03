import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CityService, CountryService, SharedModule } from '@shared';
import { MockCityService } from '../../../shared/services/city/city.service.mock';
import { MockCountryService } from '../../../shared/services/country/country.service.mock';
import { CityListComponent } from './city-list.component';

class MatDialogRefStub {
  close() {}
}

describe('CityListComponent', () => {
  let component: CityListComponent;
  let fixture: ComponentFixture<CityListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [CityListComponent],
      providers: [
        { provide: CityService, useClass: MockCityService },
        { provide: CountryService, useClass: MockCountryService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
