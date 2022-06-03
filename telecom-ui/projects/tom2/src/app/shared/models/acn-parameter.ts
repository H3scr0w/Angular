import { Networks } from './networks.model';

export class AcnParameter {
  constructor(
    public id: number = 0,
    public network: number = 0,
    public acn: string = '',
    public reminder: number = 0
  ) {}
}

export class AcnParameterDTO {
  constructor(
    public id: number = 0,
    public acn: string = '',
    public network: Networks = new Networks(),
    public reminder: number = 0
  ) {}
}
