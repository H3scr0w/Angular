/**
 * The ReportSite model
 */
export class ReportSite {
  constructor(
    public siteCode: string = null,
    public orderId: string = null,
    public action: string = null,
    public deploymentStatus: string = null,
    public deviceStatus: string = null,
    public connectionCode: string = null,
    public startOfBilling: Date = null,
    public endOfBilling: Date = null,
    public siteArchiveDate: Date = null
  ) {}
}
