import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared';
import { AcnParameterService } from '../../../shared/service/acn-parameter/acn-parameter.service';
import { MockAcnParameterService } from '../../../shared/service/acn-parameter/acn-parameter.service.mock';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { NetworksService } from '../../../shared/service/networks/networks.service';
import { MockNetworksService } from '../../../shared/service/networks/networks.service.mock';
import { AcnParameterDialogComponent } from './acn-parameter-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('AcnParameterDialogComponent', () => {
  let component: AcnParameterDialogComponent;
  let fixture: ComponentFixture<AcnParameterDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot(), HttpClientModule],
      declarations: [AcnParameterDialogComponent],
      providers: [
        { provide: NetworksService, useClass: MockNetworksService },
        { provide: AcnParameterService, useClass: MockAcnParameterService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcnParameterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
