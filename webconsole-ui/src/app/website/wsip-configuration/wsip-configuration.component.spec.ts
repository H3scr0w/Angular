import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared';
import { setUpTestBed } from '../../../test.common.spec';
import { websiteReducer } from '../../core/webconsole/website.reducer';
import { WsipConfigurationComponent } from './wsip-configuration.component';

describe('WsipConfigurationComponent', () => {
  let component: WsipConfigurationComponent;
  let fixture: ComponentFixture<WsipConfigurationComponent>;

  setUpTestBed({
    declarations: [WsipConfigurationComponent],
    imports: [
      RouterTestingModule.withRoutes([]),
      SharedModule,
      BrowserAnimationsModule,
      StoreModule.forRoot({
        website: websiteReducer
      })
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WsipConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
