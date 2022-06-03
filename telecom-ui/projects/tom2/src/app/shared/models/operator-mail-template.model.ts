import { Networks } from './networks.model';

export class OperatorMailTemplate {
  constructor(
    public id: number = 0,
    public mailBody: string = '',
    public recipient: string = '',
    public network: number = 0,
    public carbonCopy: string = '',
    public objet: string = '',
    public country: string = '',
    public date: Date = null,
    public networks: Networks = new Networks()
  ) {}
}
