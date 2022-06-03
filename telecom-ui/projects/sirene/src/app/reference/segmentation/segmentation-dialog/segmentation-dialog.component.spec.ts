import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService, SharedModule } from '@shared';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { MockMessageService } from '../../../shared/services/message/message.service.mock';
import { MockSectorService } from '../../../shared/services/sector/sector.service.mock';
import { SegmentationService } from '../../../shared/services/segmentation/segmentation.service';
import { SegmentationDialogComponent } from './segmentation-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('SegmentationDialogComponent', () => {
  let component: SegmentationDialogComponent;
  let fixture: ComponentFixture<SegmentationDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: SegmentationService, useClass: MockSectorService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [SegmentationDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
