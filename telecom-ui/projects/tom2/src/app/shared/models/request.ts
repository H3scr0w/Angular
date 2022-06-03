import { AcnParameter } from './acn-parameter';
import { Action } from './action';
import { Catalog } from './catalog';
import { ICatalogItem } from './catalog-options';
import { IdName } from './id-name';
import { Operator } from './operators';

export class Request {
  constructor(
    public id: number = 0,
    public requestStatus: IdName = null,
    public requestType: IdName = null,
    public acnParameter: AcnParameter = null,
    public creationDate: Date = null,
    public lastUpdate: Date = null,
    public ownerId: number = 0,
    public ownerName: string = '',
    public orderWithoutRValidation: string = '',
    public eligibilityResponse: string = '',
    public operatorSDate: Date = null,
    public operatorRDate: Date = null,
    public action: Action = new Action(),
    public sgtSiteCode: string = '',
    public network: number = 0,
    public serviceNumber: string = '',
    public site: string = '',
    public siteFixPhone: string = '',
    public address: string = '',
    public zipCode: string = '',
    public city: string = '',
    public country: string = '',
    public managementMode: string = '',
    public priority: string = '',
    public dcrd: Date = null,
    public comments: string = '',
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
    public currency: string = '',
    public catalog: Catalog = new Catalog(),
    public catalogVersion: string = '',
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
    public setupMainLlCost: number = 0,
    public setupMainIpPortCost: number = 0,
    public setupMainCpeCost: number = 0,
    public setupBackupLlCost: number = 0,
    public setupBackupIpPortCost: number = 0,
    public setupBackupCpeCost: number = 0,
    public setupComments: string = '',
    public setupTotalCost: number = 0,
    public setupTotalCostTaxes: number = 0,
    public monthlyMainLlCost: number = 0,
    public monthlyMainIpPortCost: number = 0,
    public monthlyMainCpeCost: number = 0,
    public monthlyBackupLlCost: number = 0,
    public monthlyBackupIpPortCost: number = 0,
    public monthlyBackupCpeCost: number = 0,
    public monthlyComments: string = '',
    public monthlyTotalCost: number = 0,
    public monthlyTotalCostTaxes: number = 0,
    public operatorsId: number = 0,
    public contractId: number = 0,
    public serviceId: number = 0,
    public sgtSiteCoderequestId: number = 0,
    public lastUser: string = '',
    public monthlyOtherDiscount: number = 0,
    public setupOtherDiscount: number = 0,
    public optionCodes: string = '',
    public serviceTitle: string = '',
    public device1NetworkMask1: string = '',
    public primaryDhcpServer: string = '',
    public secondaryDhcpServer: string = '',
    public device1CpeLanIpAddress1: string = '',
    public device1NetworkIpAddress1: string = '',
    public subactionId: number = 0,
    public device2CpeLanIpAddress1: string = '',
    public device2NetworkMask1: string = '',
    public device2NetworkIpAddress1: string = '',
    public eligibilityPhoneNumber: string = '',
    public replaced: string = '',
    public notify: string = '0',
    public chargebackId: string = '',
    public opertors: Operator = new Operator(),
    public catalogId: number = 0,
    public orderId: string = ''
  ) {}
}

export class RequestFilter {
  constructor(
    public sgtSiteCode: string = '',
    public requestId: number = 0,
    public operatorId: number = null,
    public requestTypeId: number = null,
    public status: number = null,
    public rsmId: number = null,
    public requesterId: number = null,
    public sectorId: string = null,
    public zoneId: number = null,
    public companyId: string = null,
    public country: string = null,
    public priority: string = null
  ) {}
}

export class RequestOperatorItemsId {
  constructor(public requestId: number = 0, public label: string = '') {}
}

export class RequestOperatorItem {
  constructor(public id: RequestOperatorItemsId = null, public value: string = '', public request: Request) {}
}

export class RequestItem implements ICatalogItem {
  constructor(
    public id: number = 0,
    public request: Request = null,
    public name: string = '',
    public value: string = '',
    public type: string = ''
  ) {}
}
