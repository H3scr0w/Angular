export const enum queuesEnum {
  'Unknown',
  'SGT - Service',
  'Carrier',
  'Carrier Response'
}

export class Queues {
  constructor(public id: number = 0, public name: string = '') {}
}
