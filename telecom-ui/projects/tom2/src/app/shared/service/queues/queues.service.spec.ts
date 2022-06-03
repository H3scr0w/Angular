import { TestBed } from '@angular/core/testing';

import { Queues } from '../../models/queues';
import { QueuesService } from './queues.service';

describe('MockQueuesService', () => {
  let queuesService: QueuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueuesService]
    });
  });

  beforeEach(() => {
    queuesService = TestBed.inject(QueuesService);
  });

  it('should be created', () => {
    const service: QueuesService = TestBed.inject(QueuesService);
    expect(service).toBeTruthy();
  });

  it('should return actions', () => {
    const expectedActions: Queues[] = [
      { id: 0, name: 'Unknown' },
      { id: 1, name: 'SGT - Service' },
      { id: 3, name: 'Carrier' },
      { id: 4, name: 'Carrier Response' }
    ];

    const actulAction = queuesService.getQueues();
    expect(actulAction).toEqual(expectedActions);
  });
});
