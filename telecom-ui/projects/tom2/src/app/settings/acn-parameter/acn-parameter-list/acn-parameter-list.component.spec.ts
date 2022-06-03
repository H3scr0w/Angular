import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../../core';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../../shared';
import { AcnParameterService } from '../../../shared/service/acn-parameter/acn-parameter.service';
import { MockAcnParameterService } from '../../../shared/service/acn-parameter/acn-parameter.service.mock';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { NetworksService } from '../../../shared/service/networks/networks.service';
import { MockNetworksService } from '../../../shared/service/networks/networks.service.mock';
import { AcnParameterListComponent } from './acn-parameter-list.component';

class MatDialogRefStub {
  close() {}
}

describe('AcnParameterListComponent', () => {
  let component: AcnParameterListComponent;
  let fixture: ComponentFixture<AcnParameterListComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot(), HttpClientModule],
      declarations: [AcnParameterListComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: NetworksService, useClass: MockNetworksService },
        { provide: AcnParameterService, useClass: MockAcnParameterService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcnParameterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
