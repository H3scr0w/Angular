import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule, SiteService } from '../../shared';
import { MockSiteService } from '../../shared/services/site/site.service.mock';
import { SiteReportComponent } from './site-report.component';

describe('SiteReportComponent', () => {
  let component: SiteReportComponent;
  let fixture: ComponentFixture<SiteReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [{ provide: SiteService, useClass: MockSiteService }],
      declarations: [SiteReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
