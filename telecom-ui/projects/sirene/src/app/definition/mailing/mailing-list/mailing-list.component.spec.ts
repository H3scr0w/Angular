import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MailingListService, SharedModule } from '@shared';
import { MockMailingListService } from '../../../shared/services/mailing-list/mailing-list.service.mock';
import { MailingListComponent } from './mailing-list.component';

class MatDialogRefStub {
  close() {}
}

describe('MailingListComponent', () => {
  let component: MailingListComponent;
  let fixture: ComponentFixture<MailingListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, MatDialogModule, BrowserAnimationsModule, TranslateModule.forRoot()],
      declarations: [MailingListComponent],
      providers: [
        { provide: MailingListService, useClass: MockMailingListService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
