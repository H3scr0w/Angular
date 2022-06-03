import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService, SectorService, SharedModule, ZoneService } from '@shared';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { MockMessageService } from '../../../shared/services/message/message.service.mock';
import { MockSectorService } from '../../../shared/services/sector/sector.service.mock';
import { MockZoneService } from '../../../shared/services/zone/zone.service.mock';
import { ZoneDialogComponent } from './zone-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('ZoneDialogComponent', () => {
  let component: ZoneDialogComponent;
  let fixture: ComponentFixture<ZoneDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: ZoneService, useClass: MockZoneService },
        { provide: SectorService, useClass: MockSectorService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ],
      declarations: [ZoneDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
