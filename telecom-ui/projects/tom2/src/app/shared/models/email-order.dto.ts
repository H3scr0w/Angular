export class EmailOrderDTO {
  constructor(
    public id: number = 0,
    public mailBody: string = '',
    public recipient: string = '',
    public network: number = 0,
    public carbonCopy: string = '',
    public objet: string = '',
    public country: string = '',
    public networks: number = 0,
    public orderId: string = '',
    public orderIds: string[] = []
  ) {}
}
