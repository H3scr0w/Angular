import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule, ZoneService } from '@shared';
import { MockZoneService } from '../../shared/services/zone/zone.service.mock';
import { ZoneHomeComponent } from './zone-home.component';

describe('ZoneHomeComponent', () => {
  let component: ZoneHomeComponent;
  let fixture: ComponentFixture<ZoneHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [{ provide: ZoneService, useClass: MockZoneService }],
      declarations: [ZoneHomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
