/**
 * Site Modification Request Model
 */
export class SiteModificationRequest {
  constructor(
    public id: number = 0,
    public subject: string = '',
    public comments: string = '',
    public applicant: number = 0,
    public requestDate: Date = null,
    public archiveDate: Date = null,
    public archiveUser: string = '',
    public status: string = ''
  ) {}
}
