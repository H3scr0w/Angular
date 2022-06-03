import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyService, SharedModule, SiteService } from '@shared';
import { MockCompanyService } from '../../shared/services/company/company.service.mock';
import { RequestSelectorService } from '../../shared/services/request-selector/request-selector.service';
import { MockRequestSelectorService } from '../../shared/services/request-selector/request-selector.service.mock';
import { MockSiteService } from '../../shared/services/site/site.service.mock';
import { RequestSelectorComponent } from './request-selector.component';

class MatDialogRefStub {
  close() {}
}

describe('RequestSelectorComponent', () => {
  let component: RequestSelectorComponent;
  let fixture: ComponentFixture<RequestSelectorComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: RequestSelectorService, useClass: MockRequestSelectorService },
        { provide: SiteService, useClass: MockSiteService },
        { provide: CompanyService, useClass: MockCompanyService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        }
      ],
      declarations: [RequestSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
