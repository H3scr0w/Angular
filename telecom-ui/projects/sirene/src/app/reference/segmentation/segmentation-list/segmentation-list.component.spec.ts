import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { SegmentationService } from '../../../shared/services/segmentation/segmentation.service';
import { SegmentationServiceMock } from '../../../shared/services/segmentation/segmentation.service.mock';
import { SegmentationListComponent } from './segmentation-list.component';

class MatDialogRefStub {
  close() {}
}

describe('SegmentationListComponent', () => {
  let component: SegmentationListComponent;
  let fixture: ComponentFixture<SegmentationListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: SegmentationService, useClass: SegmentationServiceMock },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        MatSnackBar
      ],
      declarations: [SegmentationListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
