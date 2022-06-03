import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DelegationService, SharedModule } from '@shared';
import { MockDelegationService } from '../../shared/services/delegation/delegation.service.mock';
import { DelegationHomeComponent } from './delegation-home.component';

describe('DelegationHomeComponent', () => {
  let component: DelegationHomeComponent;
  let fixture: ComponentFixture<DelegationHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [{ provide: DelegationService, useClass: MockDelegationService }],
      declarations: [DelegationHomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
