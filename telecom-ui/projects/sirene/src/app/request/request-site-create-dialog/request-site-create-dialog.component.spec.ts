import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {
  CityService,
  CompanyService,
  CountryService,
  SectorService,
  SharedModule,
  SiteTypeService,
  ZoneService
} from '@shared';
import { MockCityService } from '../../shared/services/city/city.service.mock';
import { MockCompanyService } from '../../shared/services/company/company.service.mock';
import { MockCountryService } from '../../shared/services/country/country.service.mock';
import { MockSectorService } from '../../shared/services/sector/sector.service.mock';
import { SegmentationService } from '../../shared/services/segmentation/segmentation.service';
import { SegmentationServiceMock } from '../../shared/services/segmentation/segmentation.service.mock';
import { MockSiteTypeService } from '../../shared/services/site-type/site-type.service.mock';
import { MockZoneService } from '../../shared/services/zone/zone.service.mock';
import { RequestSiteCreateDialogComponent } from './request-site-create-dialog.component';

class MatDialogRefStub {
  close() {}
}

class MatSnackBarRef {
  close() {}
}

describe('RequestSiteCreateDialogComponent', () => {
  let component: RequestSiteCreateDialogComponent;
  let fixture: ComponentFixture<RequestSiteCreateDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();
  const matSnackBarRefStub = new MatSnackBarRef();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        HttpClientModule,
        MatDialogModule,
        MatSnackBarModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        {
          provide: MatSnackBarRef,
          useValue: matSnackBarRefStub
        },
        { provide: MAT_DIALOG_DATA },
        { provide: SiteTypeService, useClass: MockSiteTypeService },
        { provide: SectorService, useClass: MockSectorService },
        { provide: ZoneService, useClass: MockZoneService },
        { provide: CompanyService, useClass: MockCompanyService },
        { provide: CountryService, useClass: MockCountryService },
        { provide: CityService, useClass: MockCityService },
        { provide: SegmentationService, useClass: SegmentationServiceMock }
      ],
      declarations: [RequestSiteCreateDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSiteCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
