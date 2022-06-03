export class FinancialInformation {
  constructor(
    public setupMainLlCost: number = 0,
    public setupMainIpPortCost: number = 0,
    public setupMainCpeCost: number = 0,
    public setupBackupLlCost: number = 0,
    public setupBackupIpPortCost: number = 0,
    public setupBackupCpeCost: number = 0,
    public setupTotalCost: number = 0,
    public setupOtherDiscount: number = 0,
    public setupTotalCostTaxes: number = 0,
    public setupTotalCostAfterDiscount: number = 0,
    public setupComments: string = '',
    public monthlyMainLlCost: number = 0,
    public monthlyMainIpPortCost: number = 0,
    public monthlyMainCpeCost: number = 0,
    public monthlyBackupLlCost: number = 0,
    public monthlyBackupIpPortCost: number = 0,
    public monthlyBackupCpeCost: number = 0,
    public monthlyTotalCost: number = 0,
    public monthlyOtherDiscount: number = 0,
    public monthlyTotalCostTaxes: number = 0,
    public monthlyTotalCostAfterDiscount: number = 0,
    public monthlyComments: string = '',
    public currency: string = ''
  ) {}
}
