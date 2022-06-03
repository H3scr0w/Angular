import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../../../../../sirene/src/app/shared/services/contact/contact.service';
import { MockContactService } from '../../../../../../sirene/src/app/shared/services/contact/contact.service.mock';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { IspBandwidthService } from '../../service/isp-bandwidth/isp-bandwidth.service';
import { MockIspBandwidthService } from '../../service/isp-bandwidth/isp-bandwidth.service.mock';
import { IspCarrierService } from '../../service/isp-carrier/isp-carrier.service';
import { MockIspCarrierService } from '../../service/isp-carrier/isp-carrier.service.mock';
import { MessageService } from '../../service/message/message.service';
import { MockMessageService } from '../../service/message/message.service.mock';
import { SharedModule } from '../../shared.module';
import { IspInformationComponent } from './isp-information.component';

describe('IspInformationComponent', () => {
  let component: IspInformationComponent;
  let fixture: ComponentFixture<IspInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, HttpClientModule, TranslateModule.forRoot()],
      providers: [
        { provide: IspCarrierService, useClass: MockIspCarrierService },
        { provide: ContactService, useClass: MockContactService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: IspBandwidthService, useClass: MockIspBandwidthService },
        { provide: AuthenticationService, useClass: MockAuthenticationService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IspInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
