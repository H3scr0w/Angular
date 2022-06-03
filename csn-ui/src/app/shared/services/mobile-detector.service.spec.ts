import { TestBed } from '@angular/core/testing';

import { MobileDetectorService } from './mobile-detector.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

describe('MobileDetectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DeviceDetectorService,
    ],
    schemas: [NO_ERRORS_SCHEMA],
  }));

  it('should be created', () => {
    const service: MobileDetectorService = TestBed.inject(MobileDetectorService);
    expect(service).toBeTruthy();
  });
});
