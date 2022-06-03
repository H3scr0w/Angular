import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../..';
import { DynamicControlService } from '../../service/dynamic-control/dynamic-control.service';
import { MockDynamicControlService } from '../../service/dynamic-control/dynamic-control.service.mock';
import { OptionsCatalogComponent } from './options-catalog.component';

describe('OptionsCatalogComponent', () => {
  let component: OptionsCatalogComponent;
  let fixture: ComponentFixture<OptionsCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [{ provide: DynamicControlService, useClass: MockDynamicControlService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
