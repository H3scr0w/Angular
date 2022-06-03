export class Chargeback {
  constructor(
    public id: number = 0,
    public sapAccount: string = '',
    public label: string = '',
    public sif: string = '',
    public sru: string = '',
    public sapDeclaration: number = 0,
    public display: number = 0,
    public modificationDate: string = '',
    public rate: string = ''
  ) {}
}

export class ChargebackFilter extends Chargeback {
  constructor(public orderId: string = '') {
    super();
  }
}
