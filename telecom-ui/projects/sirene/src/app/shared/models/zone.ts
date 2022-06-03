import { Sector } from './sector';

/**
 * The Zone model
 */
export class Zone {
  constructor(
    public id: string = '',
    public name: string = '',
    public sector: Sector = new Sector(),
    public lastUser: string = '',
    public creationDate: Date = new Date(),
    public lastUpdate: Date = new Date(),
    public archiveDate: Date = new Date()
  ) {}
}

export class ZoneFilter extends Zone {
  constructor(public showArchived: boolean = false) {
    super();
  }
}
