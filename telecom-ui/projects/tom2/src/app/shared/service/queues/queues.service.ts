import { Injectable } from '@angular/core';
import { Queues } from '../../models/queues';

export interface IQueuesService {
  getQueues(): Queues[];
  getRequestQueues(): Queues[];
  getRequestTypesQueues(): Queues[];
}

@Injectable({
  providedIn: 'root'
})
export class QueuesService implements IQueuesService {
  constructor() {}

  getQueues(): Queues[] {
    const statues: Queues[] = [];
    statues.push({ id: 0, name: 'Unknown' });
    statues.push({ id: 1, name: 'SGT - Service' });
    statues.push({ id: 3, name: 'Carrier' });
    statues.push({ id: 4, name: 'Carrier Response' });

    return statues;
  }

  getRequestQueues(): Queues[] {
    const requestStatuses: Queues[] = [];
    requestStatuses.push({ id: 1, name: 'Pending' });
    requestStatuses.push({ id: 2, name: 'Waiting Operator Response' });
    requestStatuses.push({ id: 3, name: 'Ready To Order' });
    requestStatuses.push({ id: 4, name: 'Validated To Order' });
    requestStatuses.push({ id: 5, name: 'Ordered' });
    requestStatuses.push({ id: 6, name: 'Cancelled' });
    requestStatuses.push({ id: 7, name: 'Quotation not used' });
    return requestStatuses;
  }

  getRequestTypesQueues(): Queues[] {
    const requestTypes: Queues[] = [];
    requestTypes.push({ id: 1, name: 'Quotation' });
    requestTypes.push({ id: 2, name: 'Eligibility' });
    requestTypes.push({ id: 3, name: 'Eligibility & Quotation' });
    requestTypes.push({ id: 4, name: 'Order' });
    requestTypes.push({ id: 5, name: 'Termination' });
    requestTypes.push({ id: 7, name: 'Device' });
    return requestTypes;
  }
}
