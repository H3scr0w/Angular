/**
 * The Delegation model
 */
export class Delegation {
  constructor(
    public id: string = null,
    public name: string = '',
    public lastUser: string = '',
    public creationDate: Date = new Date(),
    public lastUpdate: Date = new Date(),
    public archiveDate: Date = null
  ) {}
}

export class DelegationFilter extends Delegation {
  constructor(public showArchived: boolean = false) {
    super();
  }
}
