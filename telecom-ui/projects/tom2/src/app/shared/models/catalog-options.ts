export class CatalogOptions {
  constructor(
    public id: number = 0,
    public endOfValidityDate: Date = new Date(),
    public optionCode: string = '',
    public commonCode: string = '',
    public optionName: string = '',
    public gtrCommitment: number = 0,
    public dispoCommitment: number = 0,
    public ltcCommitment: number = 0,
    public setupCost: number = 0,
    public monthlyCost: number = 0,
    public currency: string = '',
    public catalogVersionStatus: string = '',
    public status: boolean = false,
    public catalogVersion: string = '',
    public filename: string = '',
    public lastUpdate: Date = new Date(),
    public comments: string = '',
    public sgnet: string = ''
  ) {}
}

export interface ICatalogItem {
  name: string;
  value: string;
  type: string;
}
