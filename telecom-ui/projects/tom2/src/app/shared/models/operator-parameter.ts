import { Operator } from './operators';

export class OperatorParameter {
  constructor(
    public id: number = 0,
    public operator: number = 0,
    public type: string = '',
    public label: string = '',
    public countryCode: string = ''
  ) {}
}

export class OperatorParameterDTO {
  constructor(
    public id: number = 0,
    public operator: Operator = new Operator(),
    public type: string = '',
    public label: string = '',
    public countryCode: string = ''
  ) {}
}
