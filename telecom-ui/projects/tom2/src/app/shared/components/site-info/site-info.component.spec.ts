import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SiteService } from '../../../../../../sirene/src/app/shared';
import { MockSiteService } from '../../../../../../sirene/src/app/shared/services/site/site.service.mock';
import { EventEmitterService } from '../../service/event-emitter/event-emitter.service';
import { MockEventEmitterService } from '../../service/event-emitter/event-emitter.service.mock';
import { SharedModule } from '../../shared.module';
import { SiteInfoComponent } from './site-info.component';

describe('SiteInfoComponent', () => {
  let component: SiteInfoComponent;
  let fixture: ComponentFixture<SiteInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: SiteService, useClass: MockSiteService },
        { provide: EventEmitterService, useClass: MockEventEmitterService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
