import { Country } from './country';

export class City {
  constructor(
    public id: number = 0,
    public name: string = '',
    public lastUser: string = '',
    public creationDate: Date = new Date(),
    public lastUpdate: Date = new Date(),
    public archiveDate: Date = new Date(),
    public country: Country = new Country()
  ) {}
}

export class CityFilter extends City {
  constructor(public showArchived: boolean = false, public skip: boolean = false) {
    super();
  }
}
