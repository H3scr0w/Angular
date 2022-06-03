import { AcnParameter } from './acn-parameter';
import { Action } from './action';
import { Catalog } from './catalog';
import { ICatalogItem } from './catalog-options';
import { Operator } from './operators';
import { Queues } from './queues';

export class Commands {
  constructor(
    public id: number = 0,
    public action: Action = new Action(),
    public network: number = 0,
    public operator: number = 0,
    public acnParameter: AcnParameter = null,
    public localContact1FirstName: string = '',
    public localContact1LastName: string = '',
    public localContact1Phone: string = '',
    public localContact1Mobile: string = '',
    public localContact1Email: string = '',
    public localContact2FirstName: string = '',
    public localContact2LastName: string = '',
    public localContact2Phone: string = '',
    public localContact2Mobile: string = '',
    public localContact2Email: string = '',
    public notificationbusinessmail: string = '',
    public serviceNumber: string = '',
    public sgtSiteCode: string = '',
    public site: string = '',
    public address: string = '',
    public zipCode: string = '',
    public city: string = '',
    public country: string = '',
    public catalogId: number = 0,
    public mainAccessCode: string = '',
    public backupAccessCode: string = '',
    public gtrCommitment: number = 0,
    public dispoCommitment: number = 0,
    public ltcCommitment: number = 0,
    public connectionCode1: string = '',
    public connectionCode2: string = '',
    public connectionCode3: string = '',
    public routerCode1: string = '',
    public routerCode2: string = '',
    public ownerId: number = 0,
    public orderOwnerId: number = 0,
    public managementMode: string = '',
    public requestType: string = '',
    public priority: string = '',
    public queueId: number = 0,
    public dateBusinessRequest: Date = null,
    public dateInService: Date = null,
    public dateInOperator: Date = null,
    public dateOutOperator: Date = null,
    public dateCrd: Date = null,
    public dateCcd: Date = null,
    public currency: string = '',
    public financialEntityId: number = 0,
    public pdfComments: string = '',
    public sgtFollowupComments: string = '',
    public carrierFeedbackComments: string = '',
    public setupMainLlCost: string = '',
    public setupMainIpPortCost: string = '',
    public setupMainCpeCost: string = '',
    public setupBackupLlCost: string = '',
    public setupBackupIpPortCost: string = '',
    public setupBackupCpeCost: string = '',
    public setupComments: string = '',
    public setupTotalCost: string = '',
    public setupTotalCostTaxes: string = '',
    public monthlyMainIpPortCost: string = '',
    public monthlyMainCpeCost: string = '',
    public monthlyBackupLlCost: string = '',
    public monthlyBackupIpPortCost: string = '',
    public monthlyBackupCpeCost: string = '',
    public monthlyComments: string = '',
    public monthlyTotalCost: string = '',
    public monthlyTotalCostTaxes: string = '',
    public creationDate: Date = null,
    public archiveDate: Date = null,
    public orderId: string = '',
    public contractId: number = 0,
    public serviceId: number = 0,
    public serviceBasedOnCatalogue: string = '',
    public lastUser: string = '',
    public requestId: number = 0,
    public lastUpdate: Date = null,
    public siteFixPhone: string = '',
    public monthlyOtherDiscount: string = '',
    public setupOtherDiscount: string = '',
    public serviceTitle: string = '',
    public optionCodes: string = '',
    public subactionId: number = 0,
    public replaced: string = '',
    public monthlyTotalDiscount: string = '',
    public monthlyMainLlCost: string = '',
    public setupTotalDiscount: string = '',
    public deploymentStatus: string = ''
  ) {}
}

export class CommandsDTO extends Commands {
  constructor(
    public action: Action = new Action(),
    public operatorDto: Operator = new Operator(),
    public queue: Queues = new Queues(),
    public requester: string = '',
    public orderBy: string = '',
    public catalogVersion: string = '',
    public catalog: Catalog = new Catalog()
  ) {
    super();
  }
}

export class CommandsDTOForChangeService {
  constructor(
    public id: number = 0,
    public orderId: string = '',
    public mainAccessCode: string = '',
    public backupAccessCode: string = '',
    public notif: boolean = false,
    public emails: string = ''
  ) {}
}

export class CommandsFilter {
  constructor(
    public sgtSiteCode: string = '',
    public orderId: string = '',
    public requestId: number = 0,
    public operatorId: number = null,
    public status: number = null,
    public rsmId: number = null,
    public requesterId: number = null,
    public sectorId: string = null,
    public zoneId: number = null,
    public companyId: string = null,
    public mainServiceCode: string = '',
    public backupServiceCode: string = '',
    public lastOrderId: boolean = false,
    public lastFullyAcceptedOrderID: boolean = false,
    public backbone: number = 0,
    public showArchived: boolean = false,
    public skip: boolean = false
  ) {}
}
export class OrderOperatorItemsId {
  constructor(public orderId: string = '', public label: string = '') {}
}

export class OrderOperatorItem {
  constructor(public id: OrderOperatorItemsId = null, public value: string = '', public order: Commands) {}
}

export class ActiveCommandDTO {
  constructor(
    public operatorsId: number = 0,
    public orderId: string = '',
    public couple: string = '',
    public version: string = '',
    public status: boolean = false,
    public terminationRequestId: number = 0,
    public orderStatus: string = '',
    public allowOrderToTerminate: boolean = false
  ) {}
}

export class OrderItem implements ICatalogItem {
  constructor(
    public id: number,
    public order: Commands,
    public orderId: string = '',
    public name: string = '',
    public value: string = '',
    public type: string = ''
  ) {}
}

export class CancellationDTO {
  constructor(
    public orderId: string = '',
    public status: boolean = false,
    public allowCancellation: boolean = false,
    public id: number = 0,
    public deploymentStatus: string = ''
  ) {}
}
