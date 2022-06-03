import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CountryService, SharedModule } from '@shared';
import { MockCountryService } from '../../shared/services/country/country.service.mock';
import { CountryHomeComponent } from './country-home.component';

describe('CountryHomeComponent', () => {
  let component: CountryHomeComponent;
  let fixture: ComponentFixture<CountryHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [{ provide: CountryService, useClass: MockCountryService }],
      declarations: [CountryHomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
