export enum RequestStatus {
  Pending = 1,
  Waiting_Operator_Response = 2,
  ReadyToOrder = 3,
  ValidatedToOrder = 4,
  Ordered = 5,
  Cancelled = 6,
  QuotationNotUsed = 7
}

export enum RequestType {
  Quotation = 1,
  Eligibility = 2,
  Eligibility_Quotation = 3,
  Order = 4,
  Termination = 5,
  Device = 7
}

export enum RequestAction {
  Creation = 0,
  Change = 1,
  Termination = 2,
  Cancellation = 3,
  Admin = 4
}

export enum EligibilityResponse {
  OK = 1,
  KO = 0,
  NOT_USED = 2
}

export enum DynamicControlType {
  text = 'text',
  number = 'number',
  stgoNumber = 'stgoNumber'
}

export enum OrderStatus {
  Unknown = 0,
  SGT_Service = 1,
  Carrier = 3,
  Carrier_Response = 4
}

export enum BillingEntity {
  Germany_Central_Europe_Delegation = 1,
  UK_Ireland_Delegation = 2,
  SGT = 3,
  Business_invoiced_directly = 4,
  US_Delegation = 5
}

export enum SaveAction {
  save = 'save',
  save_Noitfy = 'save_notify',
  save_sendcsv = 'save_sendcsv'
}
