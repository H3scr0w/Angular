export class SiteRequest {
  constructor(
    public id: number = 0,
    public status: string = '',
    public requestName: string = '',
    public applicantName: string = '',
    public requestDate: Date = null,
    public siteCode: string = ''
  ) {}
}
