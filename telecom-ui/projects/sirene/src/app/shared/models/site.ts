import { Application } from './application';
import { Attachedfiles } from './attachedfiles.model';
import { City } from './city';
import { Company } from './company';
import { Contact } from './contact';
import { Country } from './country';
import { Sector } from './sector';
import { Segmentation } from './segmentation.model';
import { SiteType } from './site-type';
import { Zone } from './zone';

export class Site {
  constructor(
    public siteCode: string = '',
    public siteName: string = '',
    public oldSite: string = '',
    public statusSite: string = '',
    public statusDate: Date = new Date(),
    public siteOperatorOnSite: string = '',
    public siteType: SiteType = new SiteType(),
    public siteFixePhone: string = '',
    public usualName: string = '',
    public company: Company = new Company(),
    public segmentations: Segmentation[] = [],
    public backbone: number = 0,
    public address1: string = '',
    public tempUnknownAddress: string = '0',
    public address2: string = '',
    public address3: string = '',
    public longitude: string = '',
    public latitude: string = '',
    public postCode: string = '',
    public city: City = new City(),
    public timeZoneId: number = 0,
    public itManager: Contact = new Contact(),
    public rsm: Contact = new Contact(),
    public securityContact: Contact = new Contact(),
    public telephonyContact: Contact = new Contact(),
    public iptServiceManager: Contact = new Contact(),
    public notAutomaticArchived: string = '0',
    public comments: string = '',
    public numberUsers: number = 0,
    public withoutDevices: boolean = false,
    public pstnNumber: string = '',
    public secondPhoneNo: string = '',
    public isVideo: string = null,
    public attachedFiles: Attachedfiles[] = [],
    public application: Application = null,
    public creationDate: Date = new Date(),
    public lastUpdate: Date = new Date(),
    public archiveDate: Date = null,
    public lastUser: string = '',
    public rsmId: number = 0
  ) {}
}

export class SiteFilter extends Site {
  constructor(
    public showArchived: boolean = false,
    public withoutDevices: boolean = false,
    public withoutUsers: boolean = false,
    public siteCodeChar: string = null,
    public siteCodeFrom: number = 0,
    public siteCodeTo: number = 0,
    public showObsolete: boolean = false,
    public showErrors: boolean = false,
    public backbone: number = 0,
    public city: City = null,
    public company: Company = null,
    public sifCode: Company = null,
    public rsm: Contact = null,
    public sector: Sector = null,
    public zone: Zone = null,
    public country: Country = null
  ) {
    super();
  }
}

export class SiteBackbone {
  constructor(public id: number = 0, public name: string = '') {}
}
