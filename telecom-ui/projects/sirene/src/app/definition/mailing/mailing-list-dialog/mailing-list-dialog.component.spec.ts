import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MailingListService, SharedModule } from '@shared';
import { MockMailingListService } from '../../../shared/services/mailing-list/mailing-list.service.mock';
import { MailingListDialogComponent } from './mailing-list-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('MailingListDialogComponent', () => {
  let component: MailingListDialogComponent;
  let fixture: ComponentFixture<MailingListDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, BrowserAnimationsModule, TranslateModule.forRoot()],
      providers: [
        { provide: MailingListService, useClass: MockMailingListService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        { provide: MAT_DIALOG_DATA }
      ],
      declarations: [MailingListDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
