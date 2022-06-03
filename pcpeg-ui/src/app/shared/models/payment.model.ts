export class PaymentModel {
  constructor(
    public paymentId: number = 0,
    public companyId: number = 0,
    public year: number = 0,
    public paymentType: number = 0,
    public flagVersement: boolean = false,
    public flagVersementInfra: boolean = false,
    public flagVersementBlocPlie: boolean = false
  ) {}
}
