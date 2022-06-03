/**
 * The Sector model
 */
export class Sector {
  constructor(
    public id: string = '',
    public name: string = '',
    public lastUser: string = '',
    public creationDate: Date = new Date(),
    public lastUpdate: Date = new Date(),
    public archiveDate: Date = new Date()
  ) {}
}

export class SectorFilter extends Sector {
  constructor(public showArchived: boolean = false) {
    super();
  }
}
