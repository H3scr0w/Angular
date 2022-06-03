import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule, SiteService } from '@shared';
import { SiteDeletionRequestService } from '../../shared/services/site-deletion-request/site-deletion-request.service';
import { MockSiteDeletionRequestService } from '../../shared/services/site-deletion-request/site-deletion-request.service.mock';
import { SiteModificationRequestService } from '../../shared/services/site-modification-request/site-modification-request.service';
import { MockSiteModificationRequestService } from '../../shared/services/site-modification-request/site-modification-request.service.mock';
import { MockSiteService } from '../../shared/services/site/site.service.mock';
import { RequestSiteModifyDialogComponent } from './request-site-modify-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('RequestSiteModifyDialogComponent', () => {
  let component: RequestSiteModifyDialogComponent;
  let fixture: ComponentFixture<RequestSiteModifyDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot(), MatDialogModule, MatSnackBarModule],
      providers: [
        { provide: SiteModificationRequestService, useClass: MockSiteModificationRequestService },
        { provide: SiteService, useClass: MockSiteService },
        { provide: SiteDeletionRequestService, useClass: MockSiteDeletionRequestService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [RequestSiteModifyDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSiteModifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
