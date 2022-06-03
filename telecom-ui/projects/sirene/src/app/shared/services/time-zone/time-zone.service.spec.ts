import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { TimeZoneService } from './time-zone.service';

describe('TimeZoneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TimeZoneService]
    });
  });

  it('should be created', inject([TimeZoneService], (service: TimeZoneService) => {
    expect(service).toBeTruthy();
  }));
});
