import { Application } from './application';
import { Attachedfiles } from './attachedfiles.model';
import { City } from './city';
import { Company } from './company';
import { Contact } from './contact';
import { Segmentation } from './segmentation.model';
import { Site } from './site';
import { SiteType } from './site-type';

/**
 * The Site Creation Request model
 */
export class SiteCreationRequest {
  constructor(
    public id: number = 0,
    public siteCode: string = '',
    public siteName: string = '',
    public oldSite: string = '',
    public statusSite: string = '',
    public statusDate: Date = new Date(),
    public siteType: SiteType = new SiteType(),
    public siteFixePhone: string = '',
    public usualName: string = '',
    public company: Company = new Company(),
    public segmentations: Segmentation[] = [],
    public backbone: number = 0,
    public address1: string = '',
    public tempUnknownAddress: string = '',
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
    public notAutomaticArchived: string = null,
    public comments: string = '',
    public numberUsers: number = 0,
    public pstnNumber: string = '',
    public secondPhoneNo: string = '',
    public isVideo: string = null,
    public attachedFiles: Attachedfiles[] = null,
    public application: Application = null,
    public creationDate: Date = new Date(),
    public lastUpdate: Date = new Date(),
    public archiveDate: Date = null,
    public lastUser: string = '',
    public oldSelectedSite: Site = new Site()
  ) {}
}
