import { Operator } from './operators';

export class Contract {
  constructor(public id: number = 0, public code: string = '', public operator: number = 0) {}
}

export class ContractDTO {
  constructor(
    public id: number = 0,
    public code: string = '',
    public operator: Operator = new Operator(),
    public isarchived: boolean = false,
    public skip: boolean = false
  ) {}
}
