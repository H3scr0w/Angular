import { Contract } from './contracts';

export class Catalog {
  constructor(
    public id: number = 0,
    public contract: Contract = new Contract(),
    public name: string = '',
    public comments: string = '',
    public lastUpdate: Date = new Date()
  ) {}
}
