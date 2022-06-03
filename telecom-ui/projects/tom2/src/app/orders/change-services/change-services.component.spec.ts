import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../core';
import { MockAuthenticationService } from '../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../shared';
import { CommandService } from '../../shared/service/commands/command.service';
import { MockCommandService } from '../../shared/service/commands/command.service.mock';
import { MessageService } from '../../shared/service/message/message.service';
import { MockMessageService } from '../../shared/service/message/message.service.mock';
import { ChangeServicesComponent } from './change-services.component';

describe('ChangeServicesComponent', () => {
  let component: ChangeServicesComponent;
  let fixture: ComponentFixture<ChangeServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      declarations: [ChangeServicesComponent],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: CommandService, useClass: MockCommandService },
        { provide: MessageService, useClass: MockMessageService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
