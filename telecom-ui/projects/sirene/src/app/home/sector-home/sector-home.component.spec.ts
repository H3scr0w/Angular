import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SectorService, SharedModule } from '@shared';
import { MockSectorService } from '../../shared/services/sector/sector.service.mock';
import { SectorHomeComponent } from './sector-home.component';

describe('SectorHomeComponent', () => {
  let component: SectorHomeComponent;
  let fixture: ComponentFixture<SectorHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [{ provide: SectorService, useClass: MockSectorService }],
      declarations: [SectorHomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
