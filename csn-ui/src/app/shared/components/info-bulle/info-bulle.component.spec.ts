import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBulleComponent } from './info-bulle.component';
import {ModalModule, PopoverModule} from 'ngx-bootstrap';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

describe('InfoBulleComponent', () => {
  let component: InfoBulleComponent;
  let fixture: ComponentFixture<InfoBulleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoBulleComponent ],
      imports: [
        PopoverModule.forRoot(),
        ModalModule.forRoot(),
      ],
      providers: [
        DeviceDetectorService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBulleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
