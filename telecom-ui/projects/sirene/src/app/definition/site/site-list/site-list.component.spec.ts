import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule, SiteService } from '@shared';
import { of } from 'rxjs';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { MockSiteService } from '../../../shared/services/site/site.service.mock';
import { SiteListComponent } from './site-list.component';

class MatDialogRefStub {
  close() {}
}

class MatSnackBarMock {
  open(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    return null;
  }
}
describe('SiteListComponent', () => {
  let component: SiteListComponent;
  let fixture: ComponentFixture<SiteListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatDialogModule, SharedModule, TranslateModule.forRoot(), HttpClientModule],
      providers: [
        { provide: SiteService, useClass: MockSiteService },
        { provide: MatSnackBar, useClass: MatSnackBarMock },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (siteCode: string) => 'ADP001' })
          }
        }
      ],
      declarations: [SiteListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
