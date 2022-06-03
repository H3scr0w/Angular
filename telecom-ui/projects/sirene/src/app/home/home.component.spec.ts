import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import {
  CompanyService,
  CountryService,
  DelegationService,
  SectorService,
  SharedModule,
  SiteService,
  ZoneService
} from '@shared';
import { setUpTestBed } from '../../test.common.spec';
import { MockAuthenticationService } from '../core/authentication/authentication.service.mock';
import { MockCompanyService } from '../shared/services/company/company.service.mock';
import { MockCountryService } from '../shared/services/country/country.service.mock';
import { MockDelegationService } from '../shared/services/delegation/delegation.service.mock';
import { MockSectorService } from '../shared/services/sector/sector.service.mock';
import { MockSiteService } from '../shared/services/site/site.service.mock';
import { MockZoneService } from '../shared/services/zone/zone.service.mock';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { CountryHomeComponent } from './country-home/country-home.component';
import { DelegationHomeComponent } from './delegation-home/delegation-home.component';
import { HomeComponent } from './home.component';
import { SectorHomeComponent } from './sector-home/sector-home.component';
import { ZoneHomeComponent } from './zone-home/zone-home.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[translateParams]'
})
export class TranslateParamsStubDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('translateParams')
  translateParams: any;
}
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockRouter: any;

  mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  setUpTestBed({
    imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
    declarations: [
      HomeComponent,
      TranslateParamsStubDirective,
      CountryHomeComponent,
      CompanyHomeComponent,
      ZoneHomeComponent,
      SectorHomeComponent,
      DelegationHomeComponent
    ],
    providers: [
      { provide: AuthenticationService, useClass: MockAuthenticationService },
      { provide: CountryService, useClass: MockCountryService },
      { provide: CompanyService, useClass: MockCompanyService },
      { provide: ZoneService, useClass: MockZoneService },
      { provide: SectorService, useClass: MockSectorService },
      { provide: SiteService, useClass: MockSiteService },
      { provide: DelegationService, useClass: MockDelegationService },
      { provide: Router, useValue: mockRouter }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
