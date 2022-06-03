import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { CommandService } from '../../../shared/service/commands/command.service';
import { MockCommandService } from '../../../shared/service/commands/command.service.mock';
import { RequestCancellationListComponent } from './request-cancellation-list.component';

class MatDialogRefStub {
  close() {}
}

describe('RequestCancellationListComponent', () => {
  let component: RequestCancellationListComponent;
  let fixture: ComponentFixture<RequestCancellationListComponent>;
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
      declarations: [RequestCancellationListComponent],
      providers: [
        { provide: CommandService, useClass: MockCommandService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCancellationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
