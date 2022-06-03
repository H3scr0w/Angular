import { Commands } from './commands';
import { IspCarrier } from './isp-carrier';
import { Operator } from './operators';
import { Request } from './request';

export class IspInformation {
  constructor(
    public id: number = 0,
    public orderId: string = '',
    public order: Commands = new Commands(),
    public requestId: number = 0,
    public request: Request = null,
    public ispCarrierId: number = 0,
    public ispCarrier: IspCarrier = new IspCarrier(),
    public sgOrderContact: string = '',
    public otc: string = '',
    public mrc: string = '',
    public currency: string = '',
    public sgOperationalContact: string = '',
    public sla: string = '',
    public technology: string = '',
    public bandwidth: string = '',
    public publicIpAddress: string = '',
    public pppoe: string = ''
  ) {}
}

export class IspInformationFilter extends IspInformation {
  constructor(
    public operator: Operator = null,
    public mainServiceCode: string = '',
    public backUpServiceCode: string = '',
    public status: number = 0,
    public rsmId: number = null,
    public requesterId: number = null,
    public sectorId: string = null,
    public zoneId: number = null,
    public companyId: string = null,
    public lastOrderId: boolean = false,
    public lastFullyAcceptedOrderID: boolean = false,
    public backbone: number = 0
  ) {
    super();
  }
}
