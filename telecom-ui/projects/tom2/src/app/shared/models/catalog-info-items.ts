export class CatalogInfoItems {
  constructor(
    public id: number = 0,
    public name: string = '',
    public endOfValidityDate: Date = new Date(),
    public catalogVersionStatus: string = '',
    public catalogVersion: string = '',
    public status: boolean = false,
    public filename: string = '',
    public lastUpdate: Date = new Date(),
    public comments: string = '',
    public sgnet: string = ''
  ) {}
}
