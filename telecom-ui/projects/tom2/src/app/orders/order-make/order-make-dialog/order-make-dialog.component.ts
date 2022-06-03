import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import forEach from 'lodash/forEach';
import { forkJoin, of, Observable, Subject, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  mergeMap,
  startWith,
  switchMap
} from 'rxjs/operators';
import { SiteService } from '../../../../../../sirene/src/app/shared';
import { Contact } from '../../../../../../sirene/src/app/shared/models/contact';
import { ContactService } from '../../../../../../sirene/src/app/shared/services/contact/contact.service';
import { Chargeback, ChargebackFilter } from '../../../../../../tempo/src/app/shared/models/chargeback';
import { ChargebackService } from '../../../../../../tempo/src/app/shared/service/chargeback/chargeback.service';
import { AuthenticationService } from '../../../core';
import { DynamicControlBase } from '../../../shared/classes/dynamic-control-base';
import { DynamicControlOptions } from '../../../shared/classes/dynamic-control-options';
import { TextboxDynamic } from '../../../shared/classes/dynamic-textbox';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TelecomServiceSelectorDialogComponent } from '../../../shared/components/telecom-service-selector-dialog/telecom-service-selector-dialog.component';
import { BillingEntity, DynamicControlType, OrderStatus, RequestAction, SaveAction } from '../../../shared/enums/enum';
import { AcnParameterDTO } from '../../../shared/models/acn-parameter';
import { Action } from '../../../shared/models/action';
import { CatalogInfoItems } from '../../../shared/models/catalog-info-items';
import { CatalogOptions } from '../../../shared/models/catalog-options';
import {
  Commands,
  CommandsDTO,
  OrderItem,
  OrderOperatorItem,
  OrderOperatorItemsId
} from '../../../shared/models/commands';
import { EmailPreviewDialogDetails } from '../../../shared/models/email-preview-dialog-details';
import { FinancialEntityDTO } from '../../../shared/models/financial-entity';
import { FinancialInformation } from '../../../shared/models/financial-information';
import { IspInformation } from '../../../shared/models/isp-information';
import { KeyValue } from '../../../shared/models/key-value';
import { Networks, NetworksFilter } from '../../../shared/models/networks.model';
import { OperatorParameterDTO } from '../../../shared/models/operator-parameter';
import { Page } from '../../../shared/models/page.model';
import { Queues } from '../../../shared/models/queues';
import { SiteInfo } from '../../../shared/models/site-info';
import { SlaInformation } from '../../../shared/models/sla-information';
import { TelecomServiceDetail } from '../../../shared/models/telecom-service-detail';
import { TelecomService } from '../../../shared/models/telecom-service-selector';
import { AcnParameterService } from '../../../shared/service/acn-parameter/acn-parameter.service';
import { ActionService } from '../../../shared/service/action/action.service';
import { CatalogService } from '../../../shared/service/catalog/catalog.service';
import { CommandService } from '../../../shared/service/commands/command.service';
import { EventEmitterService } from '../../../shared/service/event-emitter/event-emitter.service';
import { IspBandwidthService } from '../../../shared/service/isp-bandwidth/isp-bandwidth.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { NetworksService } from '../../../shared/service/networks/networks.service';
import { OperatorParameterService } from '../../../shared/service/operatorparameter/operator-parameter.service';
import { QueuesService } from '../../../shared/service/queues/queues.service';
import { RequestService } from '../../../shared/service/request/request.service';
import { UtilService } from '../../../shared/service/util/util.service';
import { EmailPreviewDialogComponent } from '../../email-preview-dialog/email-preview-dialog.component';
import { IOrderDialogData, IOrderResultData } from './order-make-dialog-data';

@Component({
  selector: 'stgo-order-make-dialog',
  templateUrl: './order-make-dialog.component.html',
  styleUrls: ['./order-make-dialog.component.scss'],
  providers: [DatePipe, EventEmitterService]
})
export class OrderMakeDialogComponent implements OnInit, OnDestroy {
  isAdmin: boolean;
  isRequesterUser: boolean;
  isOrderUser: boolean;
  isLoading = false;
  isReadOnly = false;
  isSiteReset = false;
  actionList: Action[];
  actions: Action[];
  subActions: KeyValue[];
  networks: Observable<Networks[]>;
  statuses: Queues[];
  priorities: KeyValue[];
  services: KeyValue[];
  acns: AcnParameterDTO[];
  managementModes: KeyValue[];
  billingEntities: FinancialEntityDTO[];
  contact1Selector: Contact;
  contact2Selector: Contact;
  siteCode: string;
  // telecomService:
  ispInfo: IspInformation = new IspInformation();
  showISPSave = true;
  spoContactCallStop: boolean;
  requesterContacts: Observable<Contact[]>;

  inputNetwork: Subject<string> = new Subject<string>();
  inputRequestedBy: Subject<string> = new Subject<string>();

  financialInformation: FinancialInformation = new FinancialInformation();
  catalogInfoItems: CatalogInfoItems[] = [];
  catalogOptions: CatalogOptions[] = [];
  catalogId: number;
  isServiceFieldsReadOnly = true;
  setupCatalogOptions: any;
  monthlyCatalogOptions: any;
  telecomServiceDetails: TelecomServiceDetail = new TelecomServiceDetail();
  telecomServiceDetailCurrent: TelecomServiceDetail = new TelecomServiceDetail();
  selectedNetwork: Networks;
  lastOrder: Commands;
  installationContact1: Contact = new Contact();
  installationContact2: Contact = new Contact();
  catalogInfoItemsControls: DynamicControlBase<any>[];
  slaInfo: SlaInformation = new SlaInformation();
  operatorParameters: OperatorParameterDTO[] = [];
  operatorFields: DynamicControlBase<any>[];
  siteInfo: SiteInfo = new SiteInfo();
  showISPSection = false;
  order: Commands;
  operatorItems: any;
  orderOperatorItems: OrderOperatorItem[];
  informationItems: any;
  orderItems: OrderItem[];
  orderItemsLookup: OrderItem[];
  sitePSTN: string;
  action = SaveAction;
  chargebackList: Chargeback[];
  networkLoaded: Subject<Networks> = new Subject();
  isErrorOnSubmit = false;

  private sub$: Subscription = new Subscription();

  orderForm = this.fb.group({
    orderId: [''],
    action: [null],
    /* subAction: [null],*/
    replacementClause: { value: false, disabled: true },
    network: [null],
    service: [null],
    queueId: [null],
    requestId: [''],
    priority: [null],
    requestedBy: [null],
    orderedBy: [''],
    creationDate: [null],
    lastUpdate: [null],
    lastUpdateBy: [''],
    customerRequestedDate: [null],
    contractualDate: [null],
    businessRequestDate: [null],
    processingDate: [null],
    sendingDateToOperator: [null],
    acknowledgmentOperatorDate: [null],
    orderComments: [''],
    sgtFollowupComments: [''],
    carrierFeedback: [''],
    serviceNumber: [''],
    managementMode: [''],
    billingEntity: [],
    connectionCodeMainAccess: '',
    connectionCodeBackup: '',
    connectionCodeConcentrationPoint: '',
    acnParameter: [null],
    previousOrderId: '', // need to ask from where it will come
    dateBusinessRequest: [''],
    dateInService: [null],
    dateInOperator: [null],
    dateOutOperator: [null],
    notificationbusinessmail: ['', Validators.email]
  });

  constructor(
    public dialogRef: MatDialogRef<OrderMakeDialogComponent>,
    public fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private requestService: RequestService,
    private networkService: NetworksService,
    private queuesService: QueuesService,
    private commandService: CommandService,
    private translateService: TranslateService,
    private catalogService: CatalogService,
    private operatorParameterService: OperatorParameterService,
    private actionService: ActionService,
    private messageService: MessageService,
    private eventEmitterService: EventEmitterService,
    private ispBandwidthService: IspBandwidthService,
    private acnParameterService: AcnParameterService,
    private contactService: ContactService,
    private siteService: SiteService,
    private chargebackService: ChargebackService,
    private utilService: UtilService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: IOrderDialogData
  ) {}

  ngOnInit() {
    // Order & Admin Profile → can modify everything
    // Requester Profile → Modify ISP Section only
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;
    this.isRequesterUser = this.authenticationService.credentials.isRequesterUser;
    this.getAllActions();
    this.priorities = this.requestService.getPriorities();
    this.services = this.requestService.getServices();
    this.statuses = this.queuesService.getQueues();
    this.managementModes = this.requestService.getManagementModes();
    this.billingEntities = this.getAllFinancialEntity();

    this.networks = this.inputNetwork.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        const networkFilter: NetworksFilter = new NetworksFilter();
        if (this.data && this.data.telecomService && this.data.telecomService.operator.id) {
          networkFilter.operatorId = this.data.telecomService.operator.id;
        }
        return this.networkService.getAllNetworks('', 0, 200, 'name', 'asc', networkFilter).pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.requesterContacts = this.inputRequestedBy.pipe(
      startWith(''),
      filter(value => value && value.length > 2),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.contactService.getAllContacts(0, 200, 'firstName', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.fullName.localeCompare(b.fullName)));
          })
        );
      })
    );

    if (this.data && this.data.mode === 'add') {
      this.orderForm.patchValue({
        requestType: this.data.requestType,
        // action: this.actions ? this.actions.find(action => action.id == RequestAction.Creation): 0,
        queueId: this.statuses.find(queue => queue.id === OrderStatus.Unknown).id,
        priority: null,
        creationDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        managementMode: null,
        customerRequestedDate: null,
        network: null,
        serviceNumber: null,
        connectionCodeMainAccess: '--0',
        lastUpdate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        lastUpdateBy: this.authenticationService.credentials.sgid,
        lastUser: this.authenticationService.credentials.sgid,
        orderedBy: this.authenticationService.credentials.sgid,
        billingEntity: this.billingEntities.find(billing => billing.id === BillingEntity.SGT).id
      });

      this.setTelecomServiceDetail(this.data.telecomService);
      this.setFinancialInformation();

      if (this.data && this.data.telecomService) {
        this.getCatalogInfoItems(this.data.telecomService.catalogVersion.catalogVersion);
        this.getAllOperatorParameters(this.data.telecomService.operator.id);
        this.slaInfo.dispoCommitment = this.data.telecomService.dispoCommitment
          ? this.data.telecomService.dispoCommitment
          : null;
        this.slaInfo.gtrCommitment = this.data.telecomService.gtrCommitment
          ? this.data.telecomService.gtrCommitment
          : null;
        this.slaInfo.ltcCommitment = this.data.telecomService.ltcCommitment
          ? this.data.telecomService.ltcCommitment
          : null;

        const date = new Date();
        date.setDate(this.slaInfo.ltcCommitment ? date.getDate() + this.slaInfo.ltcCommitment : date.getDate());
        this.orderForm.patchValue({
          contractualDate: date
        });
      }
      this.manageActions(0, this.data.mode);
    } else if (this.data && this.data.order && (this.data.mode === 'edit' || this.data.mode === 'convert')) {
      this.isReadOnly = true;
      const order = this.data.order;
      if (this.data.mode === 'convert') {
        order.id = null;
      }
      this.setNetworkById(order.network);
      this.setRequestedBy(order.ownerId);

      this.orderForm.patchValue({
        orderId: order.orderId,
        action: order.action ? order.action : null,
        replacementClause: order.replaced === '1',
        network: order.network,
        serviceNumber: order.serviceNumber,
        queueId: order.queueId,
        requestId: order.requestId,
        priority: order.priority,
        orderedBy: order.orderBy,
        creationDate: this.datePipe.transform(order.creationDate, 'yyyy-MM-dd'),
        lastUpdate: this.datePipe.transform(order.lastUpdate, 'yyyy-MM-dd'),
        lastUpdateBy: order.lastUser,
        acnParameter: order.acnParameter,

        customerRequestedDate: order.dateCrd,
        contractualDate: order.dateCcd,
        businessRequestDate: order.dateInService,
        processingDate: order.dateInService,
        sendingDateToOperator: order.dateInOperator,
        acknowledgmentOperatorDate: order.dateOutOperator,
        orderComments: order.pdfComments,
        sgtFollowupComments: order.sgtFollowupComments,
        carrierFeedback: order.carrierFeedbackComments,

        managementMode: order.managementMode,
        billingEntity: order.financialEntityId,
        connectionCodeMainAccess: order.connectionCode1,
        connectionCodeBackup: order.connectionCode2,
        connectionCodeConcentrationPoint: order.connectionCode3,
        previousOrderId: '',
        notificationbusinessmail: order.notificationbusinessmail
      });

      this.manageActions(order.queueId, this.data.mode);

      // SLA Info
      this.slaInfo.dispoCommitment = order.dispoCommitment;
      this.slaInfo.gtrCommitment = order.gtrCommitment;
      this.slaInfo.ltcCommitment = order.ltcCommitment;

      this.getLastOrderByOrderID(order.orderId);

      // Installation Contacts
      this.setContactInfoInEdit(order);

      // Site Info
      this.setSiteInfoInEdit(order);

      // Telecom Service
      this.setTelecomServiceDetailInEdit(order);

      // Information Items
      if (this.data.mode === 'convert') {
        this.setCatalogInfoItemsDynamicControlsInConvert(order.requestId);
      } else {
        this.setCatalogInfoItemsDynamicControlsInEdit(order.orderId);
      }

      // Operator Items
      if (this.data.mode === 'convert') {
        this.setOperatorParameterDynamicControlsInConvert(order.requestId);
      } else {
        this.setOperatorParameterDynamicControlsInEdit(order.orderId);
      }

      // Financial Information
      this.setFinancialInformationInEdit(order);

      // Connection Code
      this.networkLoaded.subscribe(network => {
        if (network) {
          if (this.data.mode === 'convert') {
            this.setConnectionCodeInConvert(
              network.code,
              order.sgtSiteCode,
              order.mainAccessCode,
              order.backupAccessCode,
              order.acnParameter.acn,
              order.serviceNumber
            );
          }
        }
      });
    }

    let mainServiceCode: string;
    if (this.data && this.data.telecomService) {
      mainServiceCode = this.data.telecomService.mainServiceCode;
    } else if (this.data && this.data.order) {
      mainServiceCode = this.data.order.mainAccessCode;
    }

    if (mainServiceCode && mainServiceCode.toUpperCase().startsWith('ZL_')) {
      this.showISPSection = true;
      if (this.data && this.data.order && this.data.mode === 'convert') {
        this.setIspInfoInConvert(this.data.order);
      } else if (this.data && this.data.order && this.data.mode === 'edit') {
        this.setIspInfoInEdit(this.data.order);
      }
    }

    this.orderForm.get('processingDate').valueChanges.subscribe(val => {
      this.setRequestStatus();
    });

    this.orderForm.get('sendingDateToOperator').valueChanges.subscribe(val => {
      this.setRequestStatus();
    });

    this.orderForm.get('acknowledgmentOperatorDate').valueChanges.subscribe(val => {
      this.setRequestStatus();
    });

    this.orderForm.get('previousOrderId').valueChanges.subscribe(val => {
      this.setChargebackById(val);
    });
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  hasError(controlName: string, errorName: string): boolean {
    if (errorName === 'pattern') {
      return this.orderForm.controls[controlName].hasError(errorName);
    }
    return this.orderForm.controls[controlName].hasError(errorName) && this.orderForm.controls[controlName].touched;
  }

  onServiceNumberSelected(serviceNumber: string) {
    if (!serviceNumber) {
      return;
    }
    this.getPreviousOrder('serviceNumber');
  }

  onNetworkSelected(network: Networks) {
    if (!network) {
      this.selectedNetwork = null;
      this.setConnectionCodeMainAccess('network');
      return;
    }

    this.orderForm.patchValue({
      acnParameter: null
    });

    this.selectedNetwork = network;
    this.getPreviousOrder('network');
    const acnFilter: AcnParameterDTO = new AcnParameterDTO();
    acnFilter.network = network;
    this.getACNParameters(acnFilter);
    this.setConnectionCodeMainAccess('network');
  }

  onACNSelected(acn: AcnParameterDTO) {
    if (!acn) {
      return;
    }
    if (acn.reminder === 2) {
      this.messageService.showWithAction(
        this.translateService.instant('request.make.acn.warning.message'),
        true,
        'warning'
      );
    }
  }

  finInfoChanged(financialInfo: FinancialInformation): void {
    if (!financialInfo) {
      this.financialInformation = new FinancialInformation();
      return;
    }
    this.financialInformation = financialInfo;
  }

  slaInfoChanged(slaInfo: SlaInformation): void {
    if (!slaInfo) {
      this.slaInfo = new SlaInformation();
      return;
    }
    this.slaInfo = slaInfo;
  }

  telecomServiceDetailChanged(telecomServiceDetail: TelecomServiceDetail): void {
    if (!telecomServiceDetail) {
      this.telecomServiceDetails = new TelecomServiceDetail();
      return;
    }
    this.telecomServiceDetails = telecomServiceDetail;
    this.catalogOptions = telecomServiceDetail.options;
    this.showISPSection =
      telecomServiceDetail.mainServiceCode && telecomServiceDetail.mainServiceCode.toUpperCase().startsWith('ZL_');
  }

  onServiceFreeFillChanged() {
    this.isServiceFieldsReadOnly = !this.isServiceFieldsReadOnly;
    this.setTelecomServiceDetail(this.data.telecomService);
    this.setFinancialInformation();
  }

  selectTelecomService() {
    this.dialog
      .open(TelecomServiceSelectorDialogComponent, {
        width: '1000px',
        disableClose: true,
        hasBackdrop: false,
        data: {
          operatorId: this.data.order.operatorDto ? this.data.order.operatorDto.id : null,
          countryCode: this.data.order.sgtSiteCode ? this.data.order.sgtSiteCode.substring(0, 2) : '',
          readOnlyOperator: true
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close' && result) {
          this.telecomServiceDetailCurrent = new TelecomServiceDetail();
          this.setTelecomServiceDetail(result);
          this.setFinancialInformationOnServiceChange(result);

          this.getCatalogInfoItems(result.catalogVersion.catalogVersion);
          this.getAllOperatorParameters(result.operator.id);

          this.slaInfo = new SlaInformation();
          this.slaInfo.dispoCommitment = result.dispoCommitment ? result.dispoCommitment : null;
          this.slaInfo.gtrCommitment = result.gtrCommitment ? result.gtrCommitment : null;
          this.slaInfo.ltcCommitment = result.ltcCommitment ? result.ltcCommitment : null;

          const date = new Date();
          date.setDate(this.slaInfo.ltcCommitment ? date.getDate() + this.slaInfo.ltcCommitment : date.getDate());
          this.orderForm.patchValue({
            contractualDate: date
          });
        }
      });
  }

  ispInfoChanged(ispInfo: IspInformation): void {
    if (!ispInfo) {
      return;
    }
    this.ispInfo = ispInfo;
  }

  siteChanged(siteInfo: SiteInfo): void {
    if (siteInfo && !siteInfo.siteCode) {
      this.siteInfo = siteInfo;
    } else if (this.siteInfo.siteCode !== siteInfo.siteCode) {
      // this conditon added as site changed event fire two or servral time from site info
      this.siteInfo = siteInfo;
      this.getPreviousOrder('site');
    }
    if (this.data && this.data.mode === 'add') {
      this.setConnectionCodeMainAccess('site');
    }
    this.isSiteReset = false;
  }

  pstnChanged(value: string): void {
    if (value !== 'undefined') {
      this.sitePSTN = value;
    }
  }

  installationContact1Changed(contact: Contact): void {
    if (!contact) {
      this.installationContact1 = new Contact();
      return;
    }
    this.installationContact1 = contact;
  }

  installationContact2Changed(contact: Contact): void {
    if (!contact) {
      this.installationContact2 = new Contact();
      return;
    }
    this.installationContact2 = contact;
  }

  onSubmit(action: SaveAction): void {
    let orderId: string;
    this.eventEmitterService.onFormValidate();
    const areChildFormsInvalid: boolean = this.eventEmitterService.validStatus.findIndex(val => val === false) >= 0;

    if (this.orderForm.invalid) {
      Object.keys(this.orderForm.controls).forEach(key => {
        this.orderForm.controls[key].markAllAsTouched();
      });
    }

    if (this.orderForm.invalid || areChildFormsInvalid) {
      this.messageService.show(this.translateService.instant('common.validation.required.fail.message'), 'error');
      return;
    }
    if (!this.isLoading) {
      this.isLoading = true;

      this.setRequestDataToSubmit();
      if (this.data && (this.data.mode === 'add' || this.data.mode === 'convert')) {
        this.sub$.add(
          this.commandService
            .addCommand(this.order)
            .pipe(
              mergeMap(command => {
                if (!command) {
                  this.messageService.show(this.translateService.instant('common.save.error.message'), 'error');
                  this.dialogRef.close();
                  return of(null);
                }
                orderId = command.orderId;
                const sources = [];
                this.setOrderItemsDataToSubmit(command);
                sources.push(
                  this.commandService
                    .addOrderItems(this.orderItems)
                    .pipe(catchError(error => of((this.isErrorOnSubmit = true))))
                );
                if (this.operatorItems) {
                  this.setOrderOperatorItemsDataToSubmit(command);
                  sources.push(
                    this.commandService
                      .addOrderOperatorItems(this.orderOperatorItems)
                      .pipe(catchError(error => of((this.isErrorOnSubmit = true))))
                  );
                } else if (this.showISPSection) {
                  this.setIspInfoDataToSubmit(command);
                  sources.push(
                    this.ispBandwidthService
                      .addIspBandwidth(this.ispInfo)
                      .pipe(catchError(error => of((this.isErrorOnSubmit = true))))
                  );
                } else if (this.sitePSTN) {
                  sources.push(
                    this.siteService
                      .editPSTNNumber(command.sgtSiteCode, this.sitePSTN)
                      .pipe(catchError(error => of((this.isErrorOnSubmit = true))))
                  );
                }
                return forkJoin(sources);
              }),
              finalize(() => (this.isLoading = false))
            )
            .subscribe(res => {
              if (res) {
                const orderResult = new IOrderResultData();
                orderResult.action = action;
                orderResult.orderId = orderId;
                orderResult.isAnyError = this.isErrorOnSubmit;

                if (action === SaveAction.save_sendcsv) {
                  const emailPreviewData: EmailPreviewDialogDetails = { mode: 'order', orderId: [], requestId: [] };
                  emailPreviewData.orderId.push(orderId);
                  const dialogRef = this.dialog.open(EmailPreviewDialogComponent, {
                    width: '700px',
                    disableClose: true,
                    data: emailPreviewData
                  });
                  dialogRef.afterClosed().subscribe(result => {
                    if (result !== 'close') {
                      this.dialogRef.close(orderResult);
                    }
                  });
                } else {
                  this.dialogRef.close(orderResult);
                }
              }
            })
        );
      } else {
        this.order.id = this.data.order.id;
        this.sub$.add(
          this.commandService
            .editCommand(this.order)
            .pipe(
              mergeMap(command => {
                if (!command) {
                  this.messageService.show(this.translateService.instant('common.save.error.message'), 'error');
                  this.dialogRef.close();
                  return of(null);
                }
                orderId = command.orderId;
                const sources = [];
                this.setOrderItemsDataToSubmit(command);
                sources.push(this.commandService.addOrderItems(this.orderItems));
                if (this.operatorItems) {
                  this.setOrderOperatorItemsDataToSubmit(command);
                  sources.push(this.commandService.addOrderOperatorItems(this.orderOperatorItems));
                } else if (this.showISPSection) {
                  this.setIspInfoDataToSubmit(command);
                  sources.push(this.ispBandwidthService.addIspBandwidth(this.ispInfo));
                } else if (this.sitePSTN) {
                  sources.push(this.siteService.editPSTNNumber(command.sgtSiteCode, this.sitePSTN));
                }
                return forkJoin(sources);
              }),
              finalize(() => (this.isLoading = false))
            )
            .subscribe(res => {
              if (res) {
                const orderResult = new IOrderResultData();
                orderResult.action = action;
                orderResult.orderId = orderId;
                if (action === SaveAction.save_sendcsv) {
                  const emailPreviewData: EmailPreviewDialogDetails = { mode: 'order', orderId: [], requestId: [] };
                  emailPreviewData.orderId.push(orderId);
                  const dialogRef = this.dialog.open(EmailPreviewDialogComponent, {
                    width: '700px',
                    disableClose: true,
                    data: emailPreviewData
                  });
                  dialogRef.afterClosed().subscribe(result => {
                    if (result !== 'close') {
                      this.dialogRef.close(orderResult);
                    }
                  });
                } else {
                  this.dialogRef.close(orderResult);
                }
              }
            })
        );
      }
    }
  }

  sendCSVToOperator(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.notify.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderForm.patchValue({
          sendingDateToOperator: new Date(),
          queueId: this.statuses.find(queue => queue.id === OrderStatus.Carrier).id
        });
        this.onSubmit(this.action.save_sendcsv);
      }
    });
  }

  operatorInfoChanged(operatorItems: any): void {
    if (!operatorItems) {
      return;
    }
    this.operatorItems = operatorItems;
  }

  infoItemsChanged(infoItems: any): void {
    if (!infoItems) {
      return;
    }
    this.informationItems = infoItems;
  }

  public setupCatalogOptionsChanged(catalogOptions: any): void {
    if (!catalogOptions) {
      return;
    }
    this.setupCatalogOptions = catalogOptions;
  }

  public monthlyCatalogOptionsChanged(catalogOptions: any): void {
    if (!catalogOptions) {
      return;
    }
    this.monthlyCatalogOptions = catalogOptions;
  }

  private setConnectionCodeMainAccess(value: string): void {
    if (this.data && this.data.mode === 'add') {
      let connectionCodeMainAccess = '';
      let oldConnectionCodeMainAccess = '';

      if (this.orderForm.get('connectionCodeMainAccess').value) {
        oldConnectionCodeMainAccess = this.orderForm.get('connectionCodeMainAccess').value.split('-', 3);
      } else {
        oldConnectionCodeMainAccess = '--00';
      }

      if (this.siteInfo && this.siteInfo.siteCode && this.selectedNetwork && this.selectedNetwork.code) {
        connectionCodeMainAccess =
          this.siteInfo.siteCode + '-' + this.selectedNetwork.code + '-' + oldConnectionCodeMainAccess[2];
      } else if (this.siteInfo && this.siteInfo.siteCode) {
        connectionCodeMainAccess = this.siteInfo.siteCode + '--' + oldConnectionCodeMainAccess[2];
      } else if (this.selectedNetwork && this.selectedNetwork.code) {
        connectionCodeMainAccess = '-' + this.selectedNetwork.code + '-' + oldConnectionCodeMainAccess[2];
      } else {
        connectionCodeMainAccess = '--0';
      }
      this.orderForm.patchValue({
        connectionCodeMainAccess
      });
    }
  }

  private setRequestDataToSubmit() {
    // const requestStatusId: number = this.orderForm.get('status').value;
    /* const requestTypeId: number = this.data.requestType;*/
    const network: Networks = this.orderForm.get('network').value;
    const requestedBy: Contact = this.orderForm.get('requestedBy').value;

    this.order = Object.assign(this.orderForm.value);
    this.order.network = network.id;
    this.order.acnParameter.network = network.id;
    this.order.ownerId = requestedBy ? requestedBy.id : 0;
    this.order.requestType = 'Order';
    this.order.creationDate = this.orderForm.get('creationDate').value;
    this.order.lastUpdate = this.orderForm.get('lastUpdate').value;
    if (this.orderForm.get('businessRequestDate').value) {
      this.order.dateBusinessRequest = this.orderForm.get('businessRequestDate').value;
    }
    if (this.orderForm.get('processingDate').value) {
      this.order.dateInService = this.orderForm.get('processingDate').value;
    }
    if (this.orderForm.get('acknowledgmentOperatorDate').value) {
      this.order.dateOutOperator = this.orderForm.get('acknowledgmentOperatorDate').value;
    }
    if (this.orderForm.get('sendingDateToOperator').value) {
      this.order.dateInOperator = this.orderForm.get('sendingDateToOperator').value;
    }

    // this.order.deploymentStatus = this.statuses.find(status => status.id === requestStatusId).name;

    if (this.orderForm.get('customerRequestedDate').value) {
      this.order.dateCrd = this.orderForm.get('customerRequestedDate').value;
    }
    if (this.orderForm.get('contractualDate').value) {
      this.order.dateCcd = this.orderForm.get('contractualDate').value;
    }

    /* this.order.chargebackId = this.chargebackSelected.id.toString();*/
    this.order.sgtSiteCode = this.siteInfo.siteCode;
    this.order.site = this.siteInfo.siteName;
    this.order.siteFixPhone = this.siteInfo.sitePhone;
    this.order.address = this.siteInfo.sitePhone;
    this.order.zipCode = this.siteInfo.siteZipCode;
    this.order.city = this.siteInfo.siteCity;
    this.order.country = this.siteInfo.siteCountry;
    this.order.localContact1FirstName = this.installationContact1.firstName;
    this.order.localContact1LastName = this.installationContact1.name;
    this.order.localContact1Phone = this.installationContact1.fixPhone;
    this.order.localContact1Mobile = this.installationContact1.mobilePhone;
    this.order.localContact1Email = this.installationContact1.email;
    this.order.localContact2FirstName = this.installationContact2.firstName;
    this.order.localContact2LastName = this.installationContact2.name;
    this.order.localContact2Phone = this.installationContact2.fixPhone;
    this.order.localContact2Mobile = this.installationContact2.mobilePhone;
    this.order.localContact2Email = this.installationContact2.email;
    this.order.catalogId = this.telecomServiceDetails.catalog.id;
    this.order.gtrCommitment = this.slaInfo.gtrCommitment != null ? this.slaInfo.gtrCommitment : 0;
    this.order.dispoCommitment = this.slaInfo.dispoCommitment;
    this.order.ltcCommitment = this.slaInfo.ltcCommitment;
    this.order.operator = this.telecomServiceDetails.operator.id;
    this.order.contractId = this.telecomServiceDetails.contract.id;
    this.order.serviceId = this.telecomServiceDetails.id;
    this.order.serviceTitle = this.telecomServiceDetails.serviceTitle;
    this.order.optionCodes = this.telecomServiceDetails.options
      ? this.telecomServiceDetails.options.map(opt => opt.optionCode).join()
      : null;
    this.order.mainAccessCode = this.telecomServiceDetails.mainServiceCode;
    this.order.backupAccessCode = this.telecomServiceDetails.backupServiceCode;
    this.order.routerCode1 = this.telecomServiceDetails.routerCode1;
    this.order.routerCode2 = this.telecomServiceDetails.routerCode2;

    this.order.setupMainLlCost =
      this.financialInformation.setupMainLlCost != null ? this.financialInformation.setupMainLlCost.toString() : '';
    this.order.setupMainIpPortCost =
      this.financialInformation.setupMainIpPortCost != null
        ? this.financialInformation.setupMainIpPortCost.toString()
        : '';
    this.order.setupMainCpeCost =
      this.financialInformation.setupMainCpeCost != null ? this.financialInformation.setupMainCpeCost.toString() : '';
    this.order.setupBackupLlCost =
      this.financialInformation.setupBackupLlCost != null ? this.financialInformation.setupBackupLlCost.toString() : '';
    this.order.setupBackupIpPortCost =
      this.financialInformation.setupBackupIpPortCost != null
        ? this.financialInformation.setupBackupIpPortCost.toString()
        : '';
    this.order.setupBackupCpeCost =
      this.financialInformation.setupBackupCpeCost != null
        ? this.financialInformation.setupBackupCpeCost.toString()
        : '';
    this.order.setupOtherDiscount =
      this.financialInformation.setupOtherDiscount != null
        ? this.financialInformation.setupOtherDiscount.toString()
        : '';
    this.order.setupTotalCostTaxes =
      this.financialInformation.setupTotalCostTaxes != null
        ? this.financialInformation.setupTotalCostTaxes.toString()
        : '';
    this.order.setupTotalCost =
      this.financialInformation.setupTotalCost != null ? this.financialInformation.setupTotalCost.toString() : '';
    this.order.setupComments = this.financialInformation.setupComments;
    this.order.monthlyMainLlCost =
      this.financialInformation.monthlyMainLlCost != null ? this.financialInformation.monthlyMainLlCost.toString() : '';
    this.order.monthlyMainIpPortCost =
      this.financialInformation.monthlyMainIpPortCost != null
        ? this.financialInformation.monthlyMainIpPortCost.toString()
        : '';
    this.order.monthlyMainCpeCost =
      this.financialInformation.monthlyMainCpeCost != null
        ? this.financialInformation.monthlyMainCpeCost.toString()
        : '';
    this.order.monthlyBackupLlCost =
      this.financialInformation.monthlyBackupLlCost != null
        ? this.financialInformation.monthlyBackupLlCost.toString()
        : '';
    this.order.monthlyBackupIpPortCost =
      this.financialInformation.monthlyBackupIpPortCost != null
        ? this.financialInformation.monthlyBackupIpPortCost.toString()
        : '';
    this.order.monthlyBackupCpeCost =
      this.financialInformation.monthlyBackupCpeCost != null
        ? this.financialInformation.monthlyBackupCpeCost.toString()
        : '';
    this.order.monthlyOtherDiscount =
      this.financialInformation.monthlyOtherDiscount != null
        ? this.financialInformation.monthlyOtherDiscount.toString()
        : '';
    this.order.monthlyTotalCostTaxes =
      this.financialInformation.monthlyTotalCostTaxes != null
        ? this.financialInformation.monthlyTotalCostTaxes.toString()
        : '';
    this.order.monthlyTotalCost =
      this.financialInformation.monthlyTotalCost != null ? this.financialInformation.monthlyTotalCost.toString() : '';
    this.order.monthlyComments =
      this.financialInformation.monthlyComments != null ? this.financialInformation.monthlyComments.toString() : '';
    this.order.currency = this.financialInformation.currency;
    if (this.orderForm.get('billingEntity').value) {
      this.order.financialEntityId = this.orderForm.get('billingEntity').value;
    }
    if (this.orderForm.get('connectionCodeMainAccess').value) {
      this.order.connectionCode1 = this.orderForm.get('connectionCodeMainAccess').value;
    }
    if (this.orderForm.get('connectionCodeBackup').value) {
      this.order.connectionCode2 = this.orderForm.get('connectionCodeBackup').value;
    }
    if (this.orderForm.get('connectionCodeConcentrationPoint').value) {
      this.order.connectionCode3 = this.orderForm.get('connectionCodeConcentrationPoint').value;
    }
  }

  private getPreviousOrder(caller: string): void {
    if (
      !this.selectedNetwork ||
      !this.selectedNetwork.id ||
      !this.siteInfo ||
      !this.siteInfo.siteCode ||
      !this.orderForm.get('serviceNumber').value
    ) {
      this.orderForm.patchValue({
        previousOrderId: ''
      });
      return;
    }
    this.isLoading = true;
    this.lastOrder = null;
    this.sub$.add(
      this.commandService
        .getPreviousCommandByByNetworkAndSiteCodeAndServiceNumber(
          this.selectedNetwork.id,
          this.siteInfo.siteCode,
          this.orderForm.get('serviceNumber').value
        )
        .pipe(
          finalize(() => {
            this.isLoading = false;
            if (this.lastOrder) {
              this.orderForm.patchValue({
                previousOrderId: this.lastOrder.orderId
              });
            } else {
              this.orderForm.patchValue({
                previousOrderId: 'No order found'
              });
            }

            this.setPreviousOrderInfo(this.lastOrder, caller);
          })
        )
        .subscribe((lastCommand: Commands) => {
          if (lastCommand) {
            this.lastOrder = lastCommand;
          }
        })
    );
  }

  private getLastOrderByOrderID(orderId: string): void {
    if (!orderId) {
      return;
    }
    this.isLoading = true;
    this.sub$.add(
      this.commandService
        .getPreviousCommandByOrderId(orderId)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.actions = this.actionList;
          })
        )
        .subscribe((oldCommand: Commands) => {
          if (oldCommand) {
            this.orderForm.patchValue({
              previousOrderId: oldCommand.orderId
            });

            if (oldCommand.action.id !== RequestAction.Cancellation) {
              // if status Cancellation remove 0 - creation
              this.actionList.shift();
            }
          } else {
            // remove 1- Change 2- Termination
            this.actionList = this.actionList.filter(
              obj => obj.id !== RequestAction.Change && obj.id !== RequestAction.Termination
            );
            this.orderForm.patchValue({
              previousOrderId: 'No order found'
            });
          }
        })
    );
  }

  private getAllActions(): void {
    this.isLoading = true;
    this.sub$.add(
      this.actionService
        .getAllActions(0, 50)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Action>) => {
          if (page) {
            if (this.data.mode === 'add' || this.data.mode === 'convert') {
              this.actions = page.content.filter(obj => obj.active === 'Y');
              this.orderForm.patchValue({
                action: this.actions.find(action => action.id === RequestAction.Creation)
              });
            } else {
              this.actionList = page.content.filter(obj => obj.active === 'Y');
            }
          }
        })
    );
  }

  private getAllFinancialEntity(): FinancialEntityDTO[] {
    const financialEntity: FinancialEntityDTO[] = [];
    financialEntity.push({ id: 1, name: 'Germany & Central Europe Delegation' });
    financialEntity.push({ id: 2, name: 'UK & Ireland Delegation' });
    financialEntity.push({ id: 3, name: 'SGT' });
    financialEntity.push({ id: 4, name: 'Business invoiced directly' });
    financialEntity.push({ id: 5, name: 'US Delegation' });

    return financialEntity;
  }

  private setTelecomServiceDetail(telecomService: TelecomService): void {
    if (!telecomService) {
      return;
    }
    this.catalogId = telecomService.catalogVersion.catalog.id;
    this.telecomServiceDetailCurrent.id = telecomService.id;
    this.telecomServiceDetailCurrent.operator = telecomService.operator;
    this.telecomServiceDetailCurrent.contract = telecomService.catalogVersion.catalog.contract;
    this.telecomServiceDetailCurrent.catalog = telecomService.catalogVersion.catalog;
    this.telecomServiceDetailCurrent.catalogVersion = telecomService.catalogVersion.catalogVersion;
    this.telecomServiceDetailCurrent.serviceTitle = telecomService.serviceTitle;
    this.telecomServiceDetailCurrent.mainServiceCode = telecomService.mainServiceCode;
    this.telecomServiceDetailCurrent.backupServiceCode = telecomService.backupServiceCode;
    this.telecomServiceDetailCurrent.optionsCSV = telecomService.optionsAvailables;
    this.telecomServiceDetailCurrent.routerCode1 = telecomService.routerCode1;
    this.telecomServiceDetailCurrent.routerCode2 = telecomService.routerCode2;
  }

  private setTelecomServiceDetailInEdit(order: CommandsDTO) {
    if (!order) {
      return;
    }
    this.catalogId = order.catalogId;
    this.telecomServiceDetailCurrent.id = order.serviceId;
    this.telecomServiceDetailCurrent.operator = order.operatorDto;
    this.telecomServiceDetailCurrent.catalogVersion = order.catalogVersion;
    this.telecomServiceDetailCurrent.serviceTitle = order.serviceTitle;
    this.telecomServiceDetailCurrent.mainServiceCode = order.mainAccessCode;
    this.telecomServiceDetailCurrent.backupServiceCode = order.backupAccessCode;
    this.telecomServiceDetailCurrent.optionsCSV = order.optionCodes;
    this.telecomServiceDetailCurrent.routerCode1 = order.routerCode1;
    this.telecomServiceDetailCurrent.routerCode2 = order.routerCode2;
  }

  private setFinancialInformation(): void {
    if (this.data && this.data.telecomService) {
      const finInfo: FinancialInformation = new FinancialInformation();
      finInfo.currency = this.data.telecomService.currency;

      finInfo.setupMainLlCost = this.data.telecomService.setupCostsLl1;
      finInfo.setupMainIpPortCost = this.data.telecomService.setupCostsIpPort1;
      finInfo.setupMainCpeCost = this.data.telecomService.setupCostsCpe1;
      finInfo.setupBackupLlCost = this.data.telecomService.setupCostsLl2;
      finInfo.setupBackupIpPortCost = this.data.telecomService.setupCostsIpPort2;
      finInfo.setupBackupCpeCost = this.data.telecomService.setupCostsCpe2;

      finInfo.monthlyMainLlCost = this.data.telecomService.monthlyCostsLl1;
      finInfo.monthlyMainIpPortCost = this.data.telecomService.monthlyCostsIpPort1;
      finInfo.monthlyMainCpeCost = this.data.telecomService.monthlyCostsCpe1;
      finInfo.monthlyBackupLlCost = this.data.telecomService.monthlyCostsLl2;
      finInfo.monthlyBackupIpPortCost = this.data.telecomService.monthlyCostsIpPort2;
      finInfo.monthlyBackupCpeCost = this.data.telecomService.monthlyCostsCpe2;

      this.financialInformation = finInfo;
    }
  }

  private setFinancialInformationOnServiceChange(newTelecomService: TelecomService): void {
    if (newTelecomService) {
      const finInfo: FinancialInformation = new FinancialInformation();
      finInfo.currency = newTelecomService.currency;

      finInfo.setupMainLlCost = newTelecomService.setupCostsLl1;
      finInfo.setupMainIpPortCost = newTelecomService.setupCostsIpPort1;
      finInfo.setupMainCpeCost = newTelecomService.setupCostsCpe1;
      finInfo.setupBackupLlCost = newTelecomService.setupCostsLl2;
      finInfo.setupBackupIpPortCost = newTelecomService.setupCostsIpPort2;
      finInfo.setupBackupCpeCost = newTelecomService.setupCostsCpe2;

      finInfo.monthlyMainLlCost = newTelecomService.monthlyCostsLl1;
      finInfo.monthlyMainIpPortCost = newTelecomService.monthlyCostsIpPort1;
      finInfo.monthlyMainCpeCost = newTelecomService.monthlyCostsCpe1;
      finInfo.monthlyBackupLlCost = newTelecomService.monthlyCostsLl2;
      finInfo.monthlyBackupIpPortCost = newTelecomService.monthlyCostsIpPort2;
      finInfo.monthlyBackupCpeCost = newTelecomService.monthlyCostsCpe2;
      this.financialInformation = finInfo;
    }
  }

  private setPreviousOrderInfo(command: Commands, caller: string): void {
    if (!command) {
      this.orderForm.patchValue({
        previousOrderId: 'No order found'
      });
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        disableClose: true,
        data: this.translateService.instant('order.make.previousOrder.notFound.message')
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          if (caller === 'network') {
            this.selectedNetwork = null;
            this.orderForm.patchValue({
              network: null
            });
          } else if (caller === 'site') {
            this.siteInfo = new SiteInfo();
            this.isSiteReset = true;
          } else if (caller === 'serviceNumber') {
            this.orderForm.patchValue({
              serviceNumber: null
            });
          }
        }
      });
      return;
    }
    let contact: Contact = new Contact();
    contact.firstName = command.localContact1FirstName;
    contact.name = command.localContact1LastName;
    contact.fixPhone = command.localContact1Phone;
    contact.mobilePhone = command.localContact1Mobile;
    contact.email = command.localContact1Email;
    this.installationContact1 = contact;

    contact = new Contact();
    contact.firstName = command.localContact2FirstName;
    contact.name = command.localContact2LastName;
    contact.fixPhone = command.localContact2Phone;
    contact.mobilePhone = command.localContact2Mobile;
    contact.email = command.localContact2Email;
    this.installationContact2 = contact;
  }

  private getCatalogInfoItems(catalogVersion: string): void {
    if (!catalogVersion) {
      return;
    }
    this.isLoading = true;
    this.sub$.add(
      this.catalogService
        .getCatalogInformationItems(0, 200, 'name', 'asc', '', catalogVersion)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<CatalogInfoItems>) => {
          if (page) {
            this.catalogInfoItems = page.content;
            this.setCatalogInfoItemsDynamicControls(this.catalogInfoItems);
          }
        })
    );
  }

  private setCatalogInfoItemsDynamicControls(infoItems: CatalogInfoItems[]) {
    if (!infoItems || infoItems.length === 0) {
      this.catalogInfoItemsControls = [];
      return;
    }
    let textBox: TextboxDynamic;
    let dynamicControlOptions: DynamicControlOptions<string>;
    this.catalogInfoItemsControls = [];
    infoItems.forEach(element => {
      dynamicControlOptions = new DynamicControlOptions(DynamicControlType.number, '', element.name, element.name);
      textBox = new TextboxDynamic(dynamicControlOptions);
      this.catalogInfoItemsControls.push(textBox);
    });
  }

  private setCatalogInfoItemsDynamicControlsInEdit(orderId: string): void {
    this.sub$.add(
      this.commandService.getAllOrderItems(orderId).subscribe(res => {
        if (res) {
          let textBox: TextboxDynamic;
          let dynamicControlOptions: DynamicControlOptions<string>;
          this.orderItemsLookup = res;
          this.catalogInfoItemsControls = [];
          const catalogInfoItems = res.filter(r => r.type === 'INI');
          catalogInfoItems.forEach(element => {
            dynamicControlOptions = new DynamicControlOptions(
              DynamicControlType.number,
              element.value,
              element.name,
              element.name
            );
            textBox = new TextboxDynamic(dynamicControlOptions);
            this.catalogInfoItemsControls.push(textBox);
          });
        }
      })
    );
  }

  private setCatalogInfoItemsDynamicControlsInConvert(requestId: number): void {
    this.sub$.add(
      this.requestService.getAllRequestItems(requestId).subscribe(res => {
        if (res) {
          let textBox: TextboxDynamic;
          let dynamicControlOptions: DynamicControlOptions<string>;
          this.catalogInfoItemsControls = [];
          const catalogInfoItems = res.filter(r => r.type === 'INI');
          catalogInfoItems.forEach(element => {
            dynamicControlOptions = new DynamicControlOptions(
              DynamicControlType.number,
              element.value,
              element.name,
              element.name
            );
            textBox = new TextboxDynamic(dynamicControlOptions);
            this.catalogInfoItemsControls.push(textBox);
          });
        }
      })
    );
  }

  private setOperatorParameterDynamicControls(operatorParameterList: OperatorParameterDTO[]): void {
    let textBox: TextboxDynamic;
    this.operatorFields = [];
    let dynamicControlOptions: DynamicControlOptions<string>;
    operatorParameterList.forEach(element => {
      dynamicControlOptions = new DynamicControlOptions(DynamicControlType.text, '', element.label, element.label);
      textBox = new TextboxDynamic(dynamicControlOptions);
      this.operatorFields.push(textBox);
    });
  }

  private setOperatorParameterDynamicControlsInEdit(orderId: string): void {
    if (!orderId) {
      return;
    }
    this.sub$.add(
      this.commandService.getAllOrderOperatorItems(orderId).subscribe(res => {
        if (res) {
          let textBox: TextboxDynamic;
          this.operatorFields = [];
          let dynamicControlOptions: DynamicControlOptions<string>;
          res.forEach(element => {
            dynamicControlOptions = new DynamicControlOptions(
              DynamicControlType.text,
              element.value,
              element.id.label,
              element.id.label
            );
            textBox = new TextboxDynamic(dynamicControlOptions);
            this.operatorFields.push(textBox);
          });
        }
      })
    );
  }

  private setOperatorParameterDynamicControlsInConvert(requestId: number): void {
    if (!requestId) {
      return;
    }
    this.sub$.add(
      this.requestService.getAllRequestOperatorItems(requestId).subscribe(res => {
        if (res) {
          let textBox: TextboxDynamic;
          this.operatorFields = [];
          let dynamicControlOptions: DynamicControlOptions<string>;
          res.forEach(element => {
            dynamicControlOptions = new DynamicControlOptions(
              DynamicControlType.text,
              element.value,
              element.id.label,
              element.id.label
            );
            textBox = new TextboxDynamic(dynamicControlOptions);
            this.operatorFields.push(textBox);
          });
        }
      })
    );
  }

  private getAllOperatorParameters(operatorId: number): void {
    if (!operatorId) {
      return;
    }
    this.isLoading = true;
    const operatorParameterFilter: OperatorParameterDTO = new OperatorParameterDTO();
    operatorParameterFilter.operator.id = operatorId;
    operatorParameterFilter.type = 'O';
    this.sub$.add(
      this.operatorParameterService
        .getAllOperatorParameters(0, 200, 'label', 'asc', '', operatorParameterFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<OperatorParameterDTO>) => {
          if (page) {
            this.operatorParameters = page.content;
            this.setOperatorParameterDynamicControls(this.operatorParameters);
          }
        })
    );
  }

  private setRequestStatus(): void {
    let status: number;

    const processingDate: Date = this.orderForm.get('processingDate').value;
    const sendingDateToOperator: Date = this.orderForm.get('sendingDateToOperator').value;
    const acknowledgmentOperatorDate: Date = this.orderForm.get('acknowledgmentOperatorDate').value;

    if (acknowledgmentOperatorDate) {
      status = this.statuses.find(queue => queue.id === OrderStatus.Carrier_Response).id;
    } else if (sendingDateToOperator) {
      status = this.statuses.find(queue => queue.id === OrderStatus.Carrier).id;
    } else if (processingDate) {
      status = this.statuses.find(queue => queue.id === OrderStatus.SGT_Service).id;
    } else {
      status = this.statuses.find(queue => queue.id === OrderStatus.Unknown).id;
    }

    this.orderForm.patchValue({
      queueId: status
    });
  }

  private setOrderOperatorItemsDataToSubmit(command: Commands): void {
    if (!this.operatorItems) {
      return;
    }
    let operatorItem: OrderOperatorItem;
    let operatorItemId: OrderOperatorItemsId;
    const orderOperatorItems: OrderOperatorItem[] = [];
    forEach(this.operatorItems, (value, key) => {
      operatorItemId = new OrderOperatorItemsId(command.orderId, key);
      operatorItem = new OrderOperatorItem(operatorItemId, value, command);
      orderOperatorItems.push(operatorItem);
    });
    this.orderOperatorItems = orderOperatorItems;
  }

  private setOrderItemsDataToSubmit(command: Commands): void {
    let orderItem: OrderItem;
    const orderItems: OrderItem[] = [];
    let orderItemId: number;

    if (this.informationItems) {
      forEach(this.informationItems, (value, key) => {
        orderItemId = 0;
        orderItemId = this.getOrderItemIdFromLookup(key, 'INI');
        orderItem = new OrderItem(orderItemId, command, command.orderId, key, value, 'INI');
        orderItems.push(orderItem);
      });
    }

    if (this.setupCatalogOptions) {
      forEach(this.setupCatalogOptions, (value, key) => {
        orderItemId = 0;
        orderItemId = this.getOrderItemIdFromLookup(key, 'SCI');
        orderItem = new OrderItem(orderItemId, command, command.orderId, key, value, 'SCI');
        orderItems.push(orderItem);
      });
    }

    if (this.monthlyCatalogOptions) {
      forEach(this.monthlyCatalogOptions, (value, key) => {
        orderItemId = 0;
        orderItemId = this.getOrderItemIdFromLookup(key, 'MCI');
        orderItem = new OrderItem(orderItemId, command, command.orderId, key, value, 'MCI');
        orderItems.push(orderItem);
      });
    }
    this.orderItems = orderItems;
  }

  private getOrderItemIdFromLookup(key: string, type: string): number {
    if (this.orderItemsLookup) {
      const reqItem = this.orderItemsLookup.find(itm => itm.name === key && itm.type === type);
      if (reqItem) {
        return reqItem.id;
      }
      return 0;
    }
  }

  private setIspInfoDataToSubmit(command: Commands): void {
    if (!this.showISPSection || !this.ispInfo || !command) {
      return;
    }
    this.ispInfo.order = command;
    this.ispInfo.orderId = command.orderId;
    this.ispInfo.ispCarrierId = this.ispInfo.ispCarrier.id;
  }

  private getACNParameters(acnFilter: AcnParameterDTO): void {
    this.isLoading = true;
    this.sub$.add(
      this.acnParameterService
        .getAllAcnParameters(0, 200, 'acn', 'asc', '', acnFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<AcnParameterDTO>) => {
          if (page) {
            this.acns = page.content;
          }
        })
    );
  }

  private setIspInfoInEdit(order: Commands): void {
    if (!order) {
      return;
    }
    this.sub$.add(
      this.ispBandwidthService.getIspInformationByOrder(order.orderId).subscribe(res => {
        if (res) {
          this.ispInfo = res;
          this.ispInfo.order = order;
          this.ispInfo.orderId = order.orderId;
        }
      })
    );
  }

  private setIspInfoInConvert(order: Commands): void {
    if (!order) {
      return;
    }
    this.sub$.add(
      this.ispBandwidthService.getIspInformationByRequest(order.id).subscribe(res => {
        if (res) {
          this.ispInfo = res;
          this.ispInfo.order = order;
          this.ispInfo.requestId = order.requestId;
        }
      })
    );
  }

  private setRequestedBy(ownerId: number) {
    if (!ownerId) {
      return;
    }
    this.isLoading = true;
    this.sub$.add(
      this.contactService
        .getContactById(ownerId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((contact: Contact) => {
          this.orderForm.patchValue({
            requestedBy: contact
          });
        })
    );
  }

  private setNetworkById(id: number): void {
    if (id) {
      const networkFilter: NetworksFilter = new NetworksFilter();
      networkFilter.id = id;
      this.sub$.add(
        this.networkService.getAllNetworks('', 0, 1, '', 'asc', networkFilter).subscribe(res => {
          if (res && res.content && res.content[0]) {
            this.selectedNetwork = res.content[0];
            this.networkLoaded.next(this.selectedNetwork);
            const acnFilter: AcnParameterDTO = new AcnParameterDTO();
            acnFilter.network = res.content[0];
            this.getACNParameters(acnFilter);

            this.orderForm.patchValue({
              network: res.content[0]
            });
          }
        })
      );
    }
  }

  private setContactInfoInEdit(order: CommandsDTO): void {
    if (!order) {
      return;
    }
    this.installationContact1.firstName = order.localContact1FirstName;
    this.installationContact1.name = order.localContact1LastName;
    this.installationContact1.fixPhone = order.localContact1Phone;
    this.installationContact1.mobilePhone = order.localContact1Mobile;
    this.installationContact1.email = order.localContact1Email;

    this.installationContact2.firstName = order.localContact2FirstName;
    this.installationContact2.name = order.localContact2LastName;
    this.installationContact2.fixPhone = order.localContact2Phone;
    this.installationContact2.mobilePhone = order.localContact2Mobile;
    this.installationContact2.email = order.localContact2Email;
  }

  private setSiteInfoInEdit(order: CommandsDTO): void {
    if (!order) {
      return;
    }

    this.siteInfo.siteCode = order.sgtSiteCode;
    this.siteInfo.siteName = order.site;
    this.siteInfo.sitePhone = order.siteFixPhone;
    this.siteInfo.siteAddress = order.address;
    this.siteInfo.siteZipCode = order.zipCode;
    this.siteInfo.siteCity = order.city;
    this.siteInfo.siteCountry = order.country;
  }

  private setFinancialInformationInEdit(order: CommandsDTO): void {
    if (!order) {
      return;
    }
    const finInfo: FinancialInformation = new FinancialInformation();

    // this.catalogId = req.catalog.id;
    finInfo.currency = order.currency;

    finInfo.setupMainLlCost = this.utilService.toNumber(order.setupMainLlCost);
    finInfo.setupMainIpPortCost = this.utilService.toNumber(order.setupMainIpPortCost);
    finInfo.setupMainCpeCost = this.utilService.toNumber(order.setupMainCpeCost);
    finInfo.setupBackupLlCost = this.utilService.toNumber(order.setupBackupLlCost);
    finInfo.setupBackupIpPortCost = this.utilService.toNumber(order.setupBackupIpPortCost);
    finInfo.setupBackupCpeCost = this.utilService.toNumber(order.setupBackupCpeCost);
    finInfo.setupTotalCost = this.utilService.toNumber(order.setupTotalCost);
    finInfo.setupOtherDiscount = this.utilService.toNumber(order.setupOtherDiscount);
    // finInfo.setupTotalCostAfterDiscount = req.setupTotalCostAfterDiscount;
    finInfo.setupTotalCostTaxes = this.utilService.toNumber(order.setupTotalCostTaxes);
    finInfo.setupComments = order.setupComments;

    finInfo.monthlyMainLlCost = this.utilService.toNumber(order.monthlyMainLlCost);
    finInfo.monthlyMainIpPortCost = this.utilService.toNumber(order.monthlyMainIpPortCost);
    finInfo.monthlyMainCpeCost = this.utilService.toNumber(order.monthlyMainCpeCost);
    finInfo.monthlyBackupLlCost = this.utilService.toNumber(order.monthlyBackupLlCost);
    finInfo.monthlyBackupIpPortCost = this.utilService.toNumber(order.monthlyBackupIpPortCost);
    finInfo.monthlyBackupCpeCost = this.utilService.toNumber(order.monthlyBackupCpeCost);
    finInfo.monthlyTotalCost = this.utilService.toNumber(order.monthlyTotalCost);
    finInfo.monthlyOtherDiscount = this.utilService.toNumber(order.monthlyOtherDiscount);
    // finInfo.monthlyTotalCostAfterDiscount = req.monthlyTotalCostAfterDiscount;
    finInfo.monthlyTotalCostTaxes = this.utilService.toNumber(order.monthlyTotalCostTaxes);
    finInfo.monthlyComments = order.monthlyComments;

    this.financialInformation = finInfo;
  }

  private setChargebackById(orderId: string): void {
    if (orderId) {
      const chargebackFilter: ChargebackFilter = new ChargebackFilter();
      chargebackFilter.orderId = orderId;
      this.chargebackService.url = '/tempo/chargebacks';
      this.sub$.add(
        this.chargebackService.getAllChargebacks(0, 100, '', '', '', chargebackFilter).subscribe(res => {
          if (res) {
            this.chargebackList = res.content;
          }
        })
      );
    }
  }

  private setConnectionCodeInConvert(
    netowrk: string,
    siteCode: string,
    mainAccessCode: string,
    backupAccessCode: string,
    acn: string,
    serviceNumber: string
  ): void {
    if (!netowrk && !siteCode) {
      this.orderForm.patchValue({
        connectionCodeMainAccess: null,
        connectionCodeBackup: null,
        connectionCodeConcentrationPoint: null
      });
      return;
    }

    if (!mainAccessCode) {
      mainAccessCode = '';
    }

    if (!backupAccessCode) {
      backupAccessCode = '';
    }

    if (!acn) {
      acn = '';
    }

    if (!serviceNumber) {
      serviceNumber = '';
    }

    let Nb_routers: any;
    // let connType: string;
    let startstr: string = siteCode + '-' + netowrk.substring(5, 7);
    let connectionCode1: string;
    let connectionCode2: string;
    let connectionCode3: string;

    // For QuickConnect, BronzeLight and Device
    if (netowrk.substring(5, 7) === 'PS') {
      // CAS SGNET2
      if (
        mainAccessCode.substring(0, 1) === 'G' ||
        mainAccessCode.substring(0, 1) === 'B' ||
        mainAccessCode.substring(0, 1) === 'S'
      ) {
        // QUICK CONNECT
        if (mainAccessCode.substring(0, 2) === 'QD' || mainAccessCode.substring(0, 2) === 'BD') {
          startstr = siteCode + '-SQ';
        }
        // BRONZE LIGHT
        if (mainAccessCode.substring(0, 2) === 'BF' || mainAccessCode.substring(0, 2) === 'QF') {
          startstr = siteCode + '-SW';
        }
        // DEVICE
        if (mainAccessCode.substring(0, 1) === 'D') {
          startstr = siteCode + '-OW';
        }
      } else {
        // CAS SGNET3
        // QUICK CONNECT
        if (mainAccessCode.substring(1, 2) === 'Q' || mainAccessCode.substring(1, 2) === 'G') {
          startstr = siteCode + '-SQ';
        }
        // QUICK CONNECT IP FIXED + BRONZE LIGHT + BRONZE LIGHT DYNAMIC
        if (
          mainAccessCode.substring(1, 2) === 'B' ||
          mainAccessCode.substring(1, 2) === 'D' ||
          mainAccessCode.substring(1, 2) === 'F'
        ) {
          startstr = siteCode + '-SW';
        }
        // DEVICE OPTIMIZER
        if (mainAccessCode.substring(1, 2) === 'O') {
          startstr = siteCode + '-OW';
        }
        // DEVICE SWITCH
        if (mainAccessCode.substring(1, 2) === 'S') {
          startstr = siteCode + '-SW';
        }
        // OFFLOADING
        if (mainAccessCode.substring(0, 2) === 'ZL') {
          startstr = siteCode + '-SW';
        }
      }
    }

    // MAN
    if (netowrk.substring(6, 7) === 'M') {
      startstr = siteCode + '-SL';
    }

    if (backupAccessCode !== '') {
      Nb_routers = Number(backupAccessCode.substr(0, 1));
      // connType = backupAccessCode.substr(14, 19);
    } else {
      Nb_routers = 1;
      // connType = "";
    }

    if (Nb_routers === 1 || Nb_routers === 0) {
      connectionCode1 = startstr + '-0';
      connectionCode2 = '';
      connectionCode3 = '';
    }

    if (Nb_routers === 2 || Nb_routers === 'L') {
      connectionCode1 = startstr + '-1';
      connectionCode2 = startstr + '-2';
      connectionCode3 = '';
    }

    if (Nb_routers === 2 && backupAccessCode.indexOf('ISDN') > 0) {
      connectionCode1 = startstr + '-1';
      connectionCode2 = startstr + '-9';
      connectionCode3 = '';
    }

    // DEVICE sur le network SGT_DEVICE
    if (netowrk.substring(5, 7) === 'EV') {
      let number: number = Number(serviceNumber.substring(1, 2));
      number--;
      connectionCode1 = siteCode + '-OW-' + number;
    }

    // OFFLOADING
    if (mainAccessCode.substring(0, 2) === 'ZL') {
      connectionCode1 = startstr + '-1';
      connectionCode1 = siteCode + '-SW-2';
    }

    // BACKUP 4G
    if (mainAccessCode.substring(0, 2) === 'ZX') {
      connectionCode1 = startstr + '-1';
      connectionCode1 = siteCode + '-SM-2';
    }

    // SPECIAL CASE FOR ACN 8G/8H
    if (acn === '8G' || acn === '8H') {
      switch (netowrk.substring(5, 7)) {
        case '00':
          connectionCode2 = siteCode + '-09-2';
          break;

        case '01':
          connectionCode2 = siteCode + '-08-2';
          break;

        case '03':
          connectionCode2 = siteCode + '-06-2';
          break;

        case '10':
          connectionCode2 = siteCode + '-19-2';
          break;

        case '11':
          connectionCode2 = siteCode + '-19-2';
          break;

        case '20':
          connectionCode2 = siteCode + '-29-2';
          break;

        case '30':
          connectionCode2 = siteCode + '-39-2';
          break;

        case '50':
          connectionCode2 = siteCode + '-59-2';
          break;

        case '60':
          connectionCode2 = siteCode + '-69-2';
          break;

        case '70':
          connectionCode2 = siteCode + '-79-2';
          break;

        case '80':
          connectionCode2 = siteCode + '-89-2';
          break;

        case '90':
          connectionCode2 = siteCode + '-99-2';
          break;

        case 'T0':
          connectionCode2 = siteCode + '-T9-2';
          break;

        case 'F0':
          connectionCode2 = siteCode + '-F9-2';
          break;
      }
    }

    // SPECIAL CASE FOR 14A SGT
    if (acn === '14A') {
      connectionCode1 = startstr + '-1';
      connectionCode2 = siteCode + '-SW-2';
    }

    this.orderForm.patchValue({
      connectionCodeMainAccess: connectionCode1,
      connectionCodeBackup: connectionCode2,
      connectionCodeConcentrationPoint: connectionCode3
    });
  }

  private manageActions(orderStatus: number, mode: string): void {
    if (!orderStatus && !mode) {
      return;
    }
    if (mode === 'edit') {
      // logic need to confirm which button to show
    } else if (mode === 'add') {
      // logic need to confirm which button to show
    }
  }
}
