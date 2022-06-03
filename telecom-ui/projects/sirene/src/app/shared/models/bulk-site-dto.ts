export class BulkSiteDTO {
  constructor(public sifCode: string = '', public rsmId: number = 0, public siteCodes: string[] = []) {}
}
