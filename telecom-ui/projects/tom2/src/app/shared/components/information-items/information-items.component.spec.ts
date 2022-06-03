import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicControlService } from '../../service/dynamic-control/dynamic-control.service';
import { MockDynamicControlService } from '../../service/dynamic-control/dynamic-control.service.mock';
import { SharedModule } from '../../shared.module';
import { InformationItemsComponent } from './information-items.component';

describe('InformationItemsComponent', () => {
  let component: InformationItemsComponent;
  let fixture: ComponentFixture<InformationItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [{ provide: DynamicControlService, useClass: MockDynamicControlService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
