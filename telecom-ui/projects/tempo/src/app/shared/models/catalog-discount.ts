export class CatalogDiscount {
  constructor(
    public id: number = 0,
    public catalogId: number = 0,
    public mrcDiscountRate: number = 0,
    public otcDiscountRate: number = 0,
    public applicabilityDate: string = '',
    public otcAnniversary: number = 0,
    public mrcAnniversary: number = 0
  ) {}
}
