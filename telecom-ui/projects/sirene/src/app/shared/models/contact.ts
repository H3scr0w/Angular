/**
 * The Contact model
 */
import { Country } from './country';
import { Profile } from './profile';

export class Contact {
  constructor(
    public id: number = 0,
    public name: string = '',
    public firstName: string = '',
    public fullName: string = '',
    public login: string = '',
    public profile: Profile = null,
    public countries: Country[] = [],
    public countrySupervised: string = '',
    public email: string = '',
    public title: string = '',
    public fixPhone: string = '',
    public mobilePhone: string = '',
    public creationDate: Date = null,
    public archiveDate: Date = null
  ) {}
}

export class ContactFilter extends Contact {
  constructor(public showArchived: boolean = false) {
    super();
  }
}
