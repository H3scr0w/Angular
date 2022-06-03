/**
 * Site Deletion Request Model
 */
export class SiteDeletionRequest {
  constructor(
    public id: number = 0,
    public siteCode: string = '',
    public comments: string = '',
    public applicant: number = 0,
    public requestDate: Date = null,
    public archiveDate: Date = null,
    public archiveUser: string = '',
    public status: string = ''
  ) {}
}
