import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SiteService } from '../../../../../../sirene/src/app/shared';
import { ContactService } from '../../../../../../sirene/src/app/shared/services/contact/contact.service';
import { MockContactService } from '../../../../../../sirene/src/app/shared/services/contact/contact.service.mock';
import { MockSiteService } from '../../../../../../sirene/src/app/shared/services/site/site.service.mock';
import { ChargebackService } from '../../../../../../tempo/src/app/shared/service/chargeback/chargeback.service';
import { MockChargebackService } from '../../../../../../tempo/src/app/shared/service/chargeback/chargeback.service.mock';
import { AuthenticationService } from '../../../core';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../../shared';
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
import { QueuesService } from '../../../shared/service/queues/queues.service';
import { MockQueuesService } from '../../../shared/service/queues/queues.service.mock';
import { RequestService } from '../../../shared/service/request/request.service';
import { MockRequestService } from '../../../shared/service/request/request.service.mock';
import { OrderMakeDialogComponent } from './order-make-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('OrderMakeDialogComponent', () => {
  let component: OrderMakeDialogComponent;
  let fixture: ComponentFixture<OrderMakeDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderMakeDialogComponent],
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, HttpClientModule, TranslateModule.forRoot()],
      providers: [
        { provide: RequestService, useClass: MockRequestService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: NetworksService, useClass: MockNetworksService },
        { provide: QueuesService, useClass: MockQueuesService },
        { provide: CommandService, useClass: MockCommandService },
        { provide: CatalogService, useClass: MockCatalogService },
        { provide: OperatorParameterService, useClass: MockOperatorParameterService },
        { provide: ActionService, useClass: MockActionService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: EventEmitterService, useClass: MockEventEmitterService },
        { provide: IspBandwidthService, useValue: MockIspBandwidthService },
        { provide: AcnParameterService, useClass: MockAcnParameterService },
        { provide: ContactService, useClass: MockContactService },
        { provide: SiteService, useClass: MockSiteService },
        { provide: ChargebackService, useClass: MockChargebackService },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        DatePipe,
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMakeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
