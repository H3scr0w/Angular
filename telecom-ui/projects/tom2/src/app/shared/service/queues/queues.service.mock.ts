import { Queues } from '../../models/queues';
import { IQueuesService } from './queues.service';

export class MockQueuesService implements IQueuesService {
  getQueues(): Queues[] {
    const queues: Queues[] = [];
    return queues;
  }

  getRequestQueues(): Queues[] {
    return [];
  }

  getRequestTypesQueues(): Queues[] {
    return [];
  }
}
