import { TestBed } from '@angular/core/testing';

import { EventEmitterService } from './event-emitter.service';

describe('EventEmitterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventEmitterService]
    });
  });

  it('should be created', () => {
    const service: EventEmitterService = TestBed.inject(EventEmitterService);
    expect(service).toBeTruthy();
  });
});
