import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { MockAuthenticationService } from '../../../core/authentication/authentication.service.mock';
import { NetworksService } from '../../../shared/service/networks/networks.service';
import { MockNetworksService } from '../../../shared/service/networks/networks.service.mock';
import { NetworksListComponent } from './networks-list.component';

class MatDialogRefStub {
  close() {}
}

describe('NetworksListComponent', () => {
  let component: NetworksListComponent;
  let fixture: ComponentFixture<NetworksListComponent>;

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
      declarations: [NetworksListComponent],
      providers: [
        { provide: NetworksService, useClass: MockNetworksService },
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
    fixture = TestBed.createComponent(NetworksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
