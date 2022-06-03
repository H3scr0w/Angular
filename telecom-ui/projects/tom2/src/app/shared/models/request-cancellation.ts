import { RequestCancellationStatus } from './request-cancellation-status';

import { Contact } from './contact';

export class RequestCancellation {
  constructor(
    public orderId: string = '',
    public status: RequestCancellationStatus = RequestCancellationStatus.Pending,
    public requester: string = '',
    public requestDate: Date = new Date(),
    public amount: number = 0
  ) {}
}

export class RequestCancellationDTO {
  constructor(
    public orderId: string = '',
    public status: string = '',
    public requester: Contact = new Contact(),
    public requestDate: Date = new Date(),
    public amount: number = 0
  ) {}
}

export class RequestCancellationFilter {
  constructor(public orderId: string = '', public status: string = '', public requester: Contact = null) {}
}
