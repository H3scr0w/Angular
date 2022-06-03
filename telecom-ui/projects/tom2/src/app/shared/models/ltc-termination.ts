import { Catalog } from './catalog';
import { Operator } from './operators';

export class LtcTermination {
  constructor(
    public id: number = 0,
    public operator: number = 0,
    public catalogueId: number = 0,
    public ltc: number = 0,
    public ltcMonth: number = 0
  ) {}
}

export class LtcTerminationDTO {
  constructor(
    public id: number = 0,
    public operator: Operator = new Operator(),
    public catalog: Catalog = new Catalog(),
    public ltc: number = 0,
    public ltcMonth: number = 0
  ) {}
}
