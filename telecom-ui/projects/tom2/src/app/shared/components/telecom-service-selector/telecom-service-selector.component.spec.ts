import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { OperatorsService } from '../../service/operators/operators.service';
import { MockOperatorsService } from '../../service/operators/operators.service.mock';
import { TelecomServiceSelectorService } from '../../service/telecom-service-selector/telecom-service-selector.service';
import { MockTelecomServiceSelectorService } from '../../service/telecom-service-selector/telecom-service-selector.service.mock';
import { SharedModule } from '../../shared.module';
import { TelecomServiceSelectorComponent } from './telecom-service-selector.component';

describe('TelecomServiceSelectorComponent', () => {
  let component: TelecomServiceSelectorComponent;
  let fixture: ComponentFixture<TelecomServiceSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, HttpClientModule, TranslateModule.forRoot()],
      providers: [
        { provide: TelecomServiceSelectorService, useClass: MockTelecomServiceSelectorService },
        { provide: OperatorsService, useClass: MockOperatorsService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelecomServiceSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
