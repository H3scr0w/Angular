import { Contact } from './contact';
import { Sector } from './sector';
import { Zone } from './zone';

/**
 * The Company model
 */
export class Company {
  constructor(
    public companyName: string = '',
    public sifCode: string = '',
    public zone: Zone = new Zone(),
    public sitesCount: number = 0,
    public usersCount: number = 0,
    public comments: string = '',
    public rsmAttached: Contact = null,
    public lastSiteDate: Date = null,
    public lastUser: string = '',
    public creationDate: Date = null,
    public lastUpdate: Date = null,
    public archiveDate: Date = null
  ) {}
}

export class CompanyFilter extends Company {
  constructor(
    public sector: Sector = null,
    public showArchived: boolean = false,
    public withoutSites: boolean = false,
    public skip: boolean = false
  ) {
    super();
  }
}
