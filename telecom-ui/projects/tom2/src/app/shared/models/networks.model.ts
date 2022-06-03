import { Operator } from './operators';

export class Networks {
  constructor(
    public id: number = 0,
    public name: string = '',
    public code: string = '',
    public operatorId: number = 0,
    public operator: Operator = null
  ) {}
}

export class NetworksFilter extends Networks {
  constructor() {
    super();
  }
}
