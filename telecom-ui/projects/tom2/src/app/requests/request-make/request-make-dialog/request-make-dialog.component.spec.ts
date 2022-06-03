import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceService } from '../../../../../../spo/src/app/shared/service/device.service';
import { MockDeviceService } from '../../../../../../spo/src/app/shared/service/device.service.mock';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { AcnParameterService } from '../../../shared/service/acn-parameter/acn-parameter.service';
import { MockAcnParameterService } from '../../../shared/service/acn-parameter/acn-parameter.service.mock';
import { ActionService } from '../../../shared/service/action/action.service';
import { MockActionService } from '../../../shared/service/action/action.service.mock';
import { CatalogService } from '../../../shared/service/catalog/catalog.service';
import { MockCatalogService } from '../../../shared/service/catalog/catalog.service.mock';
import { CommandService } from '../../../shared/service/commands/command.service';
import { MockCommandService } from '../../../shared/service/commands/command.service.mock';
import { EventEmitterService } from '../../../shared/service/event-emitter/event-emitter.service';
import { MockEventEmitterService } from '../../../shared/service/event-emitter/event-emitter.service.mock';
import { IspBandwidthService } from '../../../shared/service/isp-bandwidth/isp-bandwidth.service';
import { MockIspBandwidthService } from '../../../shared/service/isp-bandwidth/isp-bandwidth.service.mock';
import { MessageService } from '../../../shared/service/message/message.service';
import { MockMessageService } from '../../../shared/service/message/message.service.mock';
import { NetworksService } from '../../../shared/service/networks/networks.service';
import { MockNetworksService } from '../../../shared/service/networks/networks.service.mock';
import { OperatorParameterService } from '../../../shared/service/operatorparameter/operator-parameter.service';
import { MockOperatorParameterService } from '../../../shared/service/operatorparameter/operator-parameter.service.mock';
import { RequestService } from '../../../shared/service/request/request.service';
import { MockRequestService } from '../../../shared/service/request/request.service.mock';
import { UtilService } from '../../../shared/service/util/util.service';
import { SharedModule } from '../../../shared/shared.module';
import { RequestMakeDialogComponent } from './request-make-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('RequestMakeDialogComponent', () => {
  let component: RequestMakeDialogComponent;
  let fixture: ComponentFixture<RequestMakeDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, HttpClientModule, TranslateModule.forRoot()],
      providers: [
        { provide: OperatorParameterService, useClass: MockOperatorParameterService },
        { provide: RequestService, useClass: MockRequestService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: NetworksService, useClass: MockNetworksService },
        { provide: CatalogService, useClass: MockCatalogService },
        { provide: AcnParameterService, useClass: MockAcnParameterService },
        { provide: ActionService, useClass: MockActionService },
        { provide: CommandService, useClass: MockCommandService },
        { provide: DeviceService, useValue: MockDeviceService },
        { provide: IspBandwidthService, useValue: MockIspBandwidthService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: EventEmitterService, useClass: MockEventEmitterService },
        { provide: UtilService, useClass: UtilService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        DatePipe,
        MatSnackBar
      ],
      declarations: [RequestMakeDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMakeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
