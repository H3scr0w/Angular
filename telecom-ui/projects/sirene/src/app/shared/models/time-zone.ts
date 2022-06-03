/**
 * The Time Zone model
 */
export class TimeZone {
  constructor(
    public id: number = 0,
    public name: string = '',
    public country: string = '',
    public countryCode: string = '',
    public timeZone: string = '',
    public winterTime: string = '',
    public summerTime: string = ''
  ) {}
}
