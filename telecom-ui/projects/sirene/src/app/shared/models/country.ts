import { Delegation } from './delegation';

export class Country {
  constructor(
    public id: string = null,
    public name: string = '',
    public lastUser: string = '',
    public creationDate: Date = new Date(),
    public lastUpdate: Date = new Date(),
    public archiveDate: Date = new Date(),
    public delegation: Delegation = new Delegation(),
    public sitesCount: number = 0
  ) {}
}

export class CountryFilter extends Country {
  constructor(
    public delegation: Delegation = null,
    public showArchived: boolean = false,
    public skip: boolean = false
  ) {
    super();
  }
}
