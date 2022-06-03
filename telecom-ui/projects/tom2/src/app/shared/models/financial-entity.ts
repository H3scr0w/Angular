export class FinancialEntity {
  constructor(
    public id: number = 0,
    public name: string = '',
    public address: string = '',
    public companyCode: string = '',
    public vatNumber: string = ''
  ) {}
}

export class FinancialEntityDTO {
  constructor(public id: number = 0, public name: string = '') {}
}
