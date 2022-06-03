import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { NetworksService } from '../../shared/service/networks/networks.service';
import { MockNetworksService } from '../../shared/service/networks/networks.service.mock';
import { IspBandwidthComponent } from './isp-bandwidth.component';

class MatDialogRefStub {
  close() {}
}

describe('IspBandwidthComponent', () => {
  let component: IspBandwidthComponent;
  let fixture: ComponentFixture<IspBandwidthComponent>;
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
      declarations: [IspBandwidthComponent],
      providers: [
        { provide: NetworksService, useClass: MockNetworksService },
        {
          provide: MatDialogRef,
          useValue: matDialogRefStub
        },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IspBandwidthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
