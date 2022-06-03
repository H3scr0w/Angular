import { Company } from './company';
import { Zone } from './zone';

/**
 * The Company model
 */
export class CompanyRequest {
  constructor(
    public id: number = 0,
    public sifCode: string = '',
    public companyName: string = '',
    public zone: Zone = new Zone(),
    public crm: string = '',
    public requestType: string = '',
    public status: string = '',
    public comments: string = '',
    public requestDate: Date = new Date(),
    public exDate: Date = new Date(),
    public applicant: number = 0,
    public applicantName: string = '',
    public company: Company = new Company()
  ) {}
}
