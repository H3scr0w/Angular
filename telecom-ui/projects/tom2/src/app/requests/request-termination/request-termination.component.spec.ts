import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { MockAuthenticationService } from '../../core/authentication/authentication.service.mock';
import { CommandService } from '../../shared/service/commands/command.service';
import { MockCommandService } from '../../shared/service/commands/command.service.mock';
import { RequestService } from '../../shared/service/request/request.service';
import { MockRequestService } from '../../shared/service/request/request.service.mock';
import { RequestTerminationComponent } from './request-termination.component';

class MatDialogRefStub {
  close() {}
}

describe('RequestTerminationComponent', () => {
  let component: RequestTerminationComponent;
  let fixture: ComponentFixture<RequestTerminationComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        HttpClientModule,
        MatDialogModule
      ],
      providers: [
        { provide: CommandService, useClass: MockCommandService },
        { provide: RequestService, useClass: MockRequestService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        MatSnackBar
      ],
      declarations: [RequestTerminationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTerminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
