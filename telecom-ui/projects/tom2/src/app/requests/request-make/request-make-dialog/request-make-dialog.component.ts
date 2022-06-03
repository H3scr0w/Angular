import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import forEach from 'lodash/forEach';
import { forkJoin, of, Observable, Subject, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  mergeMap,
  startWith,
  switchMap
} from 'rxjs/operators';
import { SiteService } from '../../../../../../sirene/src/app/shared';
import { Contact } from '../../../../../../sirene/src/app/shared/models/contact';
import { DeviceService } from '../../../../../../spo/src/app/shared/service/device.service';
import { Chargeback } from '../../../../../../tempo/src/app/shared/models/chargeback';
import { ChargebackService } from '../../../../../../tempo/src/app/shared/service/chargeback/chargeback.service';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { EmailPreviewDialogComponent } from '../../../orders/email-preview-dialog/email-preview-dialog.component';
import { DynamicControlBase } from '../../../shared/classes/dynamic-control-base';
import { DynamicControlOptions } from '../../../shared/classes/dynamic-control-options';
import { TextboxDynamic } from '../../../shared/classes/dynamic-textbox';
import { ChargebackAddComponent } from '../../../shared/components/chargeback-add/chargeback-add.component';
import { ChargebackSelectComponent } from '../../../shared/components/chargeback-select/chargeback-select.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TelecomServiceSelectorDialogComponent } from '../../../shared/components/telecom-service-selector-dialog/telecom-service-selector-dialog.component';
import {
  DynamicControlType,
  EligibilityResponse,
  RequestAction,
  RequestStatus,
  RequestType
} from '../../../shared/enums/enum';
import { AcnParameterDTO } from '../../../shared/models/acn-parameter';
import { Action } from '../../../shared/models/action';
import { CatalogInfoItems } from '../../../shared/models/catalog-info-items';
import { CatalogOptions } from '../../../shared/models/catalog-options';
import { Commands } from '../../../shared/models/commands';
import { EmailPreviewDialogDetails } from '../../../shared/models/email-preview-dialog-details';
import { FinancialInformation } from '../../../shared/models/financial-information';
import { IdName } from '../../../shared/models/id-name';
import { IspInformation } from '../../../shared/models/isp-information';
import { KeyValue } from '../../../shared/models/key-value';
import { Networks, NetworksFilter } from '../../../shared/models/networks.model';
import { OperatorParameterDTO } from '../../../shared/models/operator-parameter';
import { Page } from '../../../shared/models/page.model';
import { Request, RequestItem, RequestOperatorItem, RequestOperatorItemsId } from '../../../shared/models/request';
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
import { RequestService } from '../../../shared/service/request/request.service';
import { IRequestDialogData, RequestResultDialogData } from './request-make-dialog-data';

@Component({
  selector: 'stgo-request-make-dialog',
  templateUrl: './request-make-dialog.component.html',
  styleUrls: ['./request-make-dialog.component.css'],
  providers: [DatePipe, EventEmitterService]
})
export class RequestMakeDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  isITManagerLoading: boolean;
  isPreviousOrderLoading: boolean;
  isServiceFieldsReadOnly = true;
  showFollowupFullSection = true;
  showISPSection = false;
  showEligibilityField = false;
  showReplacementClause = false;
  showSave = true;
  showSendCSV = true;
  showCancel = true;
  showOrderThisRequest = true;
  showValidateToOrder = true;
  showServiceFreeFill = true;
  showISPSave = true;
  showMainAction = true;
  showServiceChange = true;
  isCRDRequired = false;
  isSiteReset = false;
  isAdmin = false;
  isOrderUser = false;
  isRequesterUser = false;
  isPMUser = false;
  sitePSTN: string;
  requestTypes: IdName[];
  eligibilityResponses: IdName[];
  statuses: IdName[];
  priorities: KeyValue[];
  managementModes: KeyValue[];
  actions: Observable<Action[]>;
  networks: Networks[];
  services: KeyValue[];
  acns: AcnParameterDTO[];
  catalogId: number;
  operatorId: number;
  selectedNetwork: Networks;
  lastOrder: Commands;
  catalogInfoItems: CatalogInfoItems[] = [];
  catalogOptions: CatalogOptions[] = [];
  catalogInfoItemsControls: DynamicControlBase<any>[];
  operatorFields: DynamicControlBase<any>[];
  operatorParameters: OperatorParameterDTO[] = [];
  slaInfo: SlaInformation = new SlaInformation();
  siteInfo: SiteInfo = new SiteInfo();
  installationContact1: Contact = new Contact();
  installationContact2: Contact = new Contact();
  telecomServiceDetails: TelecomServiceDetail = new TelecomServiceDetail();
  telecomServiceDetailCurrent: TelecomServiceDetail = new TelecomServiceDetail();
  financialInformation: FinancialInformation = new FinancialInformation();
  chargebackSelected: Chargeback;
  command: Commands;
  request: Request;
  operatorItems: any;
  informationItems: any;
  requestOperatorItems: RequestOperatorItem[];
  requestItems: RequestItem[];
  requestItemsLookup: RequestItem[];
  setupCatalogOptions: any;
  monthlyCatalogOptions: any;
  ispInfo: IspInformation;
  spoContactCallStop: boolean;
  isErrorOnSubmit = false;

  spoContactsCall$: Subject<boolean> = new Subject<boolean>();
  inputNetwork: Subject<string> = new Subject<string>();
  inputAction: Subject<string> = new Subject<string>();
  inputACN: Subject<string> = new Subject<string>();
  catalogVersionFetched: Subject<string> = new Subject();
  catalogOptionsLookupLoaded: Subject<CatalogOptions[]> = new Subject();

  requestForm = this.fb.group({
    requestId: [''],
    requestType: [''],
    requestStatus: [''],
    priority: [''],
    replacementClause: { value: false, disabled: true },
    requestedBy: [''],
    creationDate: [''],
    lastUpdate: [''],
    lastUpdateBy: [''],
    eligibilityResponse: [''],
    autoValidationOnOperator: [''],
    operatorSDate: [''],
    operatorRDate: [''],
    comments: [''],
    sendNotificationToITManager: [''],
    itManager: [],
    managementMode: [''],
    customerRequestedDate: [''],
    action: [''],
    network: [''],
    serviceNumber: [''],
    acnParameter: [''],
    previousOrderId: [''],
    selectedChargeback: ['']
  });
  isTermination = false;
  private sub$: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<RequestMakeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRequestDialogData,
    private fb: FormBuilder,
    private operatorParameterService: OperatorParameterService,
    private requestService: RequestService,
    private authService: AuthenticationService,
    private networkService: NetworksService,
    private catalogService: CatalogService,
    private acnParameterService: AcnParameterService,
    private actionService: ActionService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private commandService: CommandService,
    private deviceService: DeviceService,
    private ispBandwidthService: IspBandwidthService,
    private chargebackService: ChargebackService,
    private eventEmitterService: EventEmitterService,
    private siteService: SiteService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.credentials.isAdmin;
    this.isOrderUser = this.authService.credentials.isOrderUser;
    this.isRequesterUser = this.authService.credentials.isRequesterUser;
    this.isPMUser = this.authService.credentials.isPmUser;

    this.requestTypes = this.requestService.getRequestTypes();
    this.statuses = this.requestService.getStatuses();
    this.priorities = this.requestService.getPriorities();
    this.eligibilityResponses = this.requestService.getEligibilityResponses();
    this.managementModes = this.requestService.getManagementModes();
    this.services = this.requestService.getServices();

    this.actions = this.inputAction.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.actionService.getAllActions(0, 200, 'value', 'asc').pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.inputNetwork.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.getAllNetworks();
    });

    this.spoContactsCall$.subscribe(value => {
      if (value) {
        this.getContactsFromSPO('secondary');
      }
    });

    // add mode
    if (this.data && this.data.mode === 'add') {
      this.requestForm.patchValue({
        requestType: this.data.requestType,
        requestStatus: RequestStatus.Pending,
        priority: null,
        replacementClause: false,
        eligibilityResponse: null,
        requestedBy: this.authService.credentials.sgid,
        creationDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        lastUpdateBy: this.authService.credentials.sgid,
        lastUpdate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        managementMode: null,
        customerRequestedDate: null,
        network: null,
        serviceNumber: null,
        acnParameter: null
      });
      this.setAction(RequestAction.Creation);
      this.setTelecomServiceDetail(this.data.telecomService);
      this.setFinancialInformation();

      if (this.data && this.data.telecomService) {
        this.operatorId = this.data.telecomService.operator.id;
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
      }
      // Manage Actions
      this.manageActions(0, this.data.mode);
    } else if (this.data && this.data.request && (this.data.mode === 'edit' || this.data.mode === 'terminate')) {
      const req = this.data.request;
      this.operatorId = req.operatorsId;
      this.requestForm.patchValue({
        requestId: req.id,
        requestType: req.requestType.id,
        requestStatus: req.requestStatus.id,
        priority: req.priority,
        replacementClause: req.replaced === '1',
        requestedBy: req.ownerName,
        creationDate: this.datePipe.transform(req.creationDate, 'yyyy-MM-dd'),
        lastUpdate: this.datePipe.transform(req.lastUpdate, 'yyyy-MM-dd'),
        lastUpdateBy: req.lastUser,
        eligibilityResponse: req.eligibilityResponse ? Number(req.eligibilityResponse) : null,
        autoValidationOnOperator: req.orderWithoutRValidation === '1',
        operatorSDate: req.operatorSDate,
        operatorRDate: req.operatorRDate,
        comments: req.comments,
        sendNotificationToITManager: req.notify === '1',
        managementMode: req.managementMode,
        customerRequestedDate: req.dcrd,
        action: req.action,
        network: req.network,
        serviceNumber: req.serviceNumber,
        acnParameter: req.acnParameter
      });

      // set ItManger
      this.setItManagerBySiteCode(req.sgtSiteCode);

      // Manage Actions
      if (this.data && !this.data?.showAction && this.data?.showAction !== undefined) {
        this.showMainAction = false;
      } else {
        this.manageActions(req.requestStatus.id, this.data.mode);
      }

      // SLA Info
      this.slaInfo.dispoCommitment = req.dispoCommitment;
      this.slaInfo.gtrCommitment = req.gtrCommitment;
      this.slaInfo.ltcCommitment = req.ltcCommitment;

      // Installation Contacts
      this.setContactInfoInEdit(req);

      // Site Info
      this.setSiteInfoInEdit(req);

      // Network
      this.setNetworkById(req.network);

      // Chargeback
      if (req.chargebackId) {
        this.setChargebackById(Number(req.chargebackId));
      }

      // Telecom Service
      this.setTelecomServiceDetailInEdit(req);

      // Information Items
      if (this.data.mode === 'terminate') {
        this.setCatalogInfoItemsDynamicControlsInTermination(req.orderId);
      } else {
        this.setCatalogInfoItemsDynamicControlsInEdit(req.id);
      }

      // Operator Items
      if (this.data.mode === 'terminate') {
        this.setOperatorParameterDynamicControlsInTerminate(req.orderId);
      } else {
        this.setOperatorParameterDynamicControlsInEdit(req.id);
      }

      // Financial Information
      this.setFinancialInformationInEdit(req);

      // Previous Order
      this.getPreviousOrder('');
    }

    // hide or show fields
    const requestType: number = this.requestForm.get('requestType').value;
    if (requestType === RequestType.Eligibility || requestType === RequestType.Eligibility_Quotation) {
      this.showEligibilityField = true;
    }

    if (
      requestType === RequestType.Order ||
      requestType === RequestType.Device ||
      requestType === RequestType.Termination
    ) {
      this.showFollowupFullSection = false;
      if ((this.data && this.data.mode === 'add') || this.data.mode === 'terminate') {
        this.setRequestStatus();
      }
    }

    if (requestType === RequestType.Device) {
      this.isCRDRequired = true;
    }

    if (requestType === RequestType.Order) {
      this.showReplacementClause = true;
    }

    if (requestType === RequestType.Termination) {
      this.isTermination = true;
    }

    let mainServiceCode: string;
    if (this.data && this.data.telecomService) {
      mainServiceCode = this.data.telecomService.mainServiceCode;
    } else if (this.data && this.data.request) {
      mainServiceCode = this.data.request.mainAccessCode;
    }

    if (mainServiceCode && mainServiceCode.toUpperCase().startsWith('ZL_')) {
      this.showISPSection = true;
      if (this.data && this.data.request && this.data.mode === 'edit') {
        this.setIspInfoInEdit(this.data.request);
      }
    }

    // subscribe to changes
    this.requestForm.get('eligibilityResponse').valueChanges.subscribe(val => {
      this.setRequestStatus();
    });

    this.requestForm.get('operatorSDate').valueChanges.subscribe(val => {
      this.setRequestStatus();
    });

    this.requestForm.get('operatorRDate').valueChanges.subscribe(val => {
      this.setRequestStatus();
    });

    this.requestForm.get('autoValidationOnOperator').valueChanges.subscribe(val => {
      this.setRequestStatus();
    });
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
    if (this.eventEmitterService.subsVar) {
      this.eventEmitterService.subsVar.unsubscribe();
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  hasError(controlName: string, errorName: string): boolean {
    if (errorName === 'pattern') {
      return this.requestForm.controls[controlName].hasError(errorName);
    }
    return this.requestForm.controls[controlName].hasError(errorName) && this.requestForm.controls[controlName].touched;
  }

  onChargebackSearchClick(): void {
    const dialogRef = this.dialog.open(ChargebackSelectComponent, {
      width: '600px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.chargebackSelected = result;
        this.setChargeback();
      }
    });
  }

  onChargebackCreateClick(): void {
    const dialogRef = this.dialog.open(ChargebackAddComponent, {
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.chargebackSelected = result;
        this.setChargeback();
      }
    });
  }

  onCRDChange(type: string, event: MatDatepickerInputEvent<Date>) {
    if (!event && !event.value) {
      return;
    }
    this.checkCRDValid(event.value, this.slaInfo ? this.slaInfo.ltcCommitment : 0);
  }

  onNetworkSelected(network: Networks) {
    if (!network) {
      this.selectedNetwork = null;
      return;
    }
    this.requestForm.patchValue({
      acnParameter: null
    });
    this.selectedNetwork = network;
    this.getPreviousOrder('network');
    const acnFilter: AcnParameterDTO = new AcnParameterDTO();
    acnFilter.network = network;
    this.getACNParameters(acnFilter);
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

  onServiceNumberSelected(serviceNumber: string) {
    if (!serviceNumber) {
      return;
    }
    this.getPreviousOrder('serviceNumber');
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

  slaInfoChanged(slaInfo: SlaInformation): void {
    if (!slaInfo) {
      this.slaInfo = new SlaInformation();
      return;
    }
    this.slaInfo = slaInfo;

    if (this.requestForm.get('customerRequestedDate').value) {
      const crdDate: Date = new Date(this.requestForm.get('customerRequestedDate').value);
      this.checkCRDValid(crdDate, this.slaInfo.ltcCommitment);
    }
  }

  siteChanged(siteInfo: SiteInfo): void {
    if (!siteInfo) {
      this.siteInfo = null;
      return;
    }
    if (siteInfo && !siteInfo.siteCode) {
      this.siteInfo = siteInfo;
    } else if (this.siteInfo.siteCode !== siteInfo.siteCode) {
      // this conditon added as site changed event fire two or servral time from site info
      this.siteInfo = siteInfo;
      this.getPreviousOrder('site');
    }
    this.requestForm.patchValue({
      itManager: this.siteInfo.itManager
    });
    this.isSiteReset = false;
  }

  pstnChanged(value: string): void {
    this.sitePSTN = value;
  }

  infoItemsChanged(infoItems: any): void {
    if (!infoItems) {
      return;
    }
    this.informationItems = infoItems;
  }

  operatorInfoChanged(operatorItems: any): void {
    if (!operatorItems) {
      return;
    }
    this.operatorItems = operatorItems;
  }

  ispInfoChanged(ispInfo: IspInformation): void {
    if (!ispInfo) {
      return;
    }
    this.ispInfo = ispInfo;
  }

  telecomServiceDetailChanged(telecomServiceDetail: TelecomServiceDetail): void {
    if (!telecomServiceDetail) {
      this.telecomServiceDetails = new TelecomServiceDetail();
      return;
    }
    this.telecomServiceDetails = telecomServiceDetail;
    this.catalogOptions = telecomServiceDetail.options;

    if (telecomServiceDetail.operator && this.operatorId !== telecomServiceDetail.operator.id) {
      this.operatorId = telecomServiceDetail.operator.id;
      this.requestForm.patchValue({
        network: null
      });
      this.getAllNetworks();
    }

    if (telecomServiceDetail.catalog && this.catalogId !== telecomServiceDetail.catalog.id) {
      this.catalogId = telecomServiceDetail.catalog.id;
    }
    this.showISPSection =
      telecomServiceDetail.mainServiceCode && telecomServiceDetail.mainServiceCode.toUpperCase().startsWith('ZL_');
  }

  finInfoChanged(financialInfo: FinancialInformation): void {
    if (!financialInfo) {
      this.financialInformation = new FinancialInformation();
      return;
    }
    this.financialInformation = financialInfo;
  }

  setupCatalogOptionsChanged(catalogOptions: any): void {
    if (!catalogOptions) {
      return;
    }
    this.setupCatalogOptions = catalogOptions;
  }

  monthlyCatalogOptionsChanged(catalogOptions: any): void {
    if (!catalogOptions) {
      return;
    }
    this.monthlyCatalogOptions = catalogOptions;
  }

  onServiceFreeFillChanged() {
    this.isServiceFieldsReadOnly = !this.isServiceFieldsReadOnly;
    this.setTelecomServiceDetail(this.data.telecomService);
    this.setFinancialInformation();
  }

  onSubmit(sendCSV: boolean, cancelRequest: boolean, orderThisRequest: boolean, validateToOrder: boolean): void {
    let requestSave: Request;
    let requestId: number;

    if (validateToOrder) {
      this.requestForm.patchValue({
        requestStatus: RequestStatus.ValidatedToOrder
      });
    }

    if (orderThisRequest) {
      this.requestForm.get('customerRequestedDate').setValidators(Validators.required);
      this.requestForm.get('customerRequestedDate').updateValueAndValidity();
    } else {
      this.requestForm.get('customerRequestedDate').clearValidators();
      this.requestForm.get('customerRequestedDate').updateValueAndValidity();
    }

    this.eventEmitterService.onFormValidate();
    const areChildFormsInvalid: boolean = this.eventEmitterService.validStatus.findIndex(val => val === false) >= 0;

    if (this.requestForm.invalid) {
      Object.keys(this.requestForm.controls).forEach(key => {
        this.requestForm.controls[key].markAllAsTouched();
      });
    }

    if (this.requestForm.invalid || areChildFormsInvalid) {
      this.messageService.show(this.translateService.instant('common.validation.required.fail.message'), 'error');
      return;
    }
    if (!this.isLoading) {
      this.isLoading = true;
      this.setRequestDataToSubmit();
      this.siteService.url = '/sirene/sites';
      if (this.data && (this.data.mode === 'add' || this.data.mode === 'terminate')) {
        this.sub$.add(
          this.requestService
            .addRequest(this.request)
            .pipe(
              mergeMap(req => {
                requestSave = req;
                requestId = req.id;
                this.setRequestOperatorItemsDataToSubmit(req);
                this.setRequestItemsDataToSubmit(req);
                const sources = [];
                sources.push(
                  this.requestService
                    .addRequestItems(this.requestItems)
                    .pipe(catchError(error => of((this.isErrorOnSubmit = true))))
                );
                sources.push(
                  this.requestService
                    .addRequestOperatorItems(this.requestOperatorItems)
                    .pipe(catchError(error => of((this.isErrorOnSubmit = true))))
                );
                if (this.showISPSection) {
                  this.setIspInfoDataToSubmit(req);
                  sources.push(
                    this.ispBandwidthService
                      .addIspBandwidth(this.ispInfo)
                      .pipe(catchError(error => of((this.isErrorOnSubmit = true))))
                  );
                } else if (this.sitePSTN) {
                  sources.push(
                    this.siteService
                      .editPSTNNumber(req.sgtSiteCode, this.sitePSTN)
                      .pipe(catchError(error => of((this.isErrorOnSubmit = true))))
                  );
                }
                return forkJoin(sources);
              }),
              finalize(() => (this.isLoading = false))
            )
            .subscribe(res => {
              if (res) {
                const requestResultDialogData: RequestResultDialogData = new RequestResultDialogData();
                requestResultDialogData.request = requestSave;
                requestResultDialogData.action = sendCSV ? 'SaveAndSendCSV' : 'Save';
                requestResultDialogData.isAnyError = this.isErrorOnSubmit;
                if (sendCSV) {
                  const emailPreviewData: EmailPreviewDialogDetails = { mode: 'request', orderId: [], requestId: [] };
                  emailPreviewData.requestId.push(requestId);
                  const dialogRef = this.dialog.open(EmailPreviewDialogComponent, {
                    width: '700px',
                    disableClose: true,
                    data: emailPreviewData
                  });
                  dialogRef.afterClosed().subscribe(result => {
                    if (result !== 'close') {
                      this.dialogRef.close(requestResultDialogData);
                    }
                  });
                } else {
                  this.dialogRef.close(requestResultDialogData);
                }
              }
            })
        );
      } else {
        this.sub$.add(
          this.requestService
            .editRequest(this.request)
            .pipe(
              mergeMap(req => {
                requestSave = req;
                requestId = req.id;
                this.setRequestOperatorItemsDataToSubmit(req);
                this.setRequestItemsDataToSubmit(req);
                const sources = [];
                sources.push(this.requestService.addRequestItems(this.requestItems));
                sources.push(this.requestService.addRequestOperatorItems(this.requestOperatorItems));
                if (this.showISPSection) {
                  this.setIspInfoDataToSubmit(req);
                  sources.push(this.ispBandwidthService.addIspBandwidth(this.ispInfo));
                } else if (this.sitePSTN) {
                  sources.push(this.siteService.editPSTNNumber(req.sgtSiteCode, this.sitePSTN));
                }
                return forkJoin(sources);
              }),
              finalize(() => (this.isLoading = false))
            )
            .subscribe(res => {
              if (res) {
                const requestResultDialogData: RequestResultDialogData = new RequestResultDialogData();
                requestSave.catalogVersion = this.request.catalogVersion;
                requestSave.opertors = this.request.opertors;
                requestResultDialogData.request = requestSave;
                requestResultDialogData.action = orderThisRequest ? 'orderThisRequest' : 'Save';

                this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
                if (sendCSV) {
                  const emailPreviewData: EmailPreviewDialogDetails = { mode: 'request', orderId: [], requestId: [] };
                  emailPreviewData.requestId.push(requestId);
                  const dialogRef = this.dialog.open(EmailPreviewDialogComponent, {
                    width: '700px',
                    disableClose: true,
                    data: emailPreviewData
                  });
                  dialogRef.afterClosed().subscribe(result => {
                    if (result !== 'close') {
                      this.dialogRef.close(requestResultDialogData);
                    }
                  });
                } else {
                  this.dialogRef.close(requestResultDialogData);
                }
                if (cancelRequest) {
                  this.messageService.show(
                    this.translateService.instant('request.make.cancel.success.message'),
                    'success'
                  );
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
        this.requestForm.patchValue({
          operatorSDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        });
        this.setRequestStatus();
        this.onSubmit(true, false, false, false);
      }
    });
  }

  cancelRequest(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('request.make.cancel.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.requestForm.patchValue({
          requestStatus: RequestStatus.Cancelled
        });
        this.onSubmit(false, true, false, false);
      }
    });
  }

  validateToOrder(): void {
    this.onSubmit(false, false, false, true);
  }

  orderThisRequest(): void {
    this.isCRDRequired = true;

    this.onSubmit(false, false, true, false);
  }

  selectTelecomService() {
    this.dialog
      .open(TelecomServiceSelectorDialogComponent, {
        width: '1000px',
        disableClose: true,
        hasBackdrop: false,
        data: {
          operatorId: this.data.request.opertors ? this.data.request.opertors.id : null,
          countryCode: this.data.request.sgtSiteCode ? this.data.request.sgtSiteCode.substring(0, 2) : '',
          readOnlyOperator: false
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close' && result) {
          this.telecomServiceDetailCurrent = new TelecomServiceDetail();
          this.setTelecomServiceDetail(result);
          this.setFinancialInformationOnServiceChange(result);

          this.operatorId = result.operator.id;
          this.getCatalogInfoItems(result.catalogVersion.catalogVersion);
          this.getAllOperatorParameters(result.operator.id);

          this.slaInfo = new SlaInformation();
          this.slaInfo.dispoCommitment = result.dispoCommitment ? result.dispoCommitment : null;
          this.slaInfo.gtrCommitment = result.gtrCommitment ? result.gtrCommitment : null;
          this.slaInfo.ltcCommitment = result.ltcCommitment ? result.ltcCommitment : null;
        }
      });
  }

  getContactsFromSPO(devicePriority: string): boolean {
    if (!this.selectedNetwork && !this.selectedNetwork.id && !this.siteInfo && !this.siteInfo.siteCode) {
      return;
    }
    let sgtConnectionCode: string = this.siteInfo.siteCode + '-' + this.selectedNetwork.code;
    if (devicePriority === 'primary') {
      sgtConnectionCode += '-0';
    } else {
      sgtConnectionCode += '-1';
    }
    this.deviceService.url = '/spo/devices';
    this.sub$.add(
      this.deviceService
        .getContactBySGTConnectionCode(sgtConnectionCode, 0, 10, null, 'asc', null)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((page: Page<Contact>) => {
          if (page) {
            if (page.content[0]) {
              this.installationContact1 = page.content[0];
            }
            if (page.content[1]) {
              this.installationContact2 = page.content[1];
            }
          } else if (!this.spoContactCallStop) {
            this.spoContactsCall$.next(true);
            this.spoContactCallStop = true;
          } else {
            this.messageService.show(
              this.translateService.instant('request.make.spoContact.notFound.message'),
              'error'
            );
          }
        })
    );
  }

  private setRequestDataToSubmit() {
    const requestStatusId: number = this.requestForm.get('requestStatus').value;
    const requestTypeId: number = this.requestForm.get('requestType').value;
    const network: Networks = this.requestForm.get('network').value;

    this.request = Object.assign(this.requestForm.value);
    if (this.data && this.data.request && this.data.mode === 'edit') {
      this.request.id = this.data.request.id;
    }

    this.request.replaced = '0';
    if (this.requestForm.get('replacementClause').value === true) {
      this.request.replaced = '1';
    }

    this.request.requestStatus = this.statuses.find(status => status.id === requestStatusId);
    this.request.requestType = this.requestTypes.find(reqType => reqType.id === requestTypeId);
    this.request.network = network.id;
    this.request.acnParameter.network = network.id;

    this.request.notify = '0';
    if (this.requestForm.get('sendNotificationToITManager').value === true) {
      this.request.notify = '1';
    }

    this.request.orderWithoutRValidation = '0';
    if (this.requestForm.get('autoValidationOnOperator').value === true) {
      this.request.orderWithoutRValidation = '1';
    }

    this.request.creationDate = this.request.creationDate;
    this.request.lastUpdate = this.request.lastUpdate;

    this.request.operatorRDate = this.request.operatorRDate;
    this.request.operatorSDate = this.request.operatorSDate;
    if (this.requestForm.get('customerRequestedDate').value) {
      this.request.dcrd = this.requestForm.get('customerRequestedDate').value;
    }
    this.request.chargebackId = this.chargebackSelected.id.toString();
    this.request.sgtSiteCode = this.siteInfo.siteCode;
    this.request.site = this.siteInfo.siteName;
    this.request.siteFixPhone = this.siteInfo.sitePhone;
    this.request.address = this.siteInfo.sitePhone;
    this.request.zipCode = this.siteInfo.siteZipCode;
    this.request.city = this.siteInfo.siteCity;
    this.request.country = this.siteInfo.siteCountry;
    this.request.localContact1FirstName = this.installationContact1.firstName;
    this.request.localContact1LastName = this.installationContact1.name;
    this.request.localContact1Phone = this.installationContact1.fixPhone;
    this.request.localContact1Mobile = this.installationContact1.mobilePhone;
    this.request.localContact1Email = this.installationContact1.email;
    this.request.localContact2FirstName = this.installationContact2.firstName;
    this.request.localContact2LastName = this.installationContact2.name;
    this.request.localContact2Phone = this.installationContact2.fixPhone;
    this.request.localContact2Mobile = this.installationContact2.mobilePhone;
    this.request.localContact2Email = this.installationContact2.email;
    this.request.catalog = this.telecomServiceDetails.catalog;
    this.request.gtrCommitment = this.slaInfo.gtrCommitment;
    this.request.dispoCommitment = this.slaInfo.dispoCommitment;
    this.request.ltcCommitment = this.slaInfo.ltcCommitment;
    this.request.operatorsId = this.telecomServiceDetails.operator.id;
    this.request.opertors = this.telecomServiceDetails.operator;
    this.request.contractId = this.telecomServiceDetails.contract.id;
    this.request.serviceId = this.telecomServiceDetails.id;
    this.request.serviceTitle = this.telecomServiceDetails.serviceTitle;
    if (this.telecomServiceDetails.options && this.telecomServiceDetails.options.length > 0) {
      this.request.optionCodes = this.telecomServiceDetails.options.map(opt => opt.optionCode).join();
    } else {
      this.request.optionCodes = '';
    }
    this.request.mainAccessCode = this.telecomServiceDetails.mainServiceCode;
    this.request.backupAccessCode = this.telecomServiceDetails.backupServiceCode;
    this.request.routerCode1 = this.telecomServiceDetails.routerCode1;
    this.request.routerCode2 = this.telecomServiceDetails.routerCode2;
    this.request.catalogVersion = this.telecomServiceDetails.catalogVersion;
    this.request.setupMainLlCost = this.financialInformation.setupMainLlCost;
    this.request.setupMainIpPortCost = this.financialInformation.setupMainIpPortCost;
    this.request.setupMainCpeCost = this.financialInformation.setupMainCpeCost;
    this.request.setupBackupLlCost = this.financialInformation.setupBackupLlCost;
    this.request.setupBackupIpPortCost = this.financialInformation.setupBackupIpPortCost;
    this.request.setupBackupCpeCost = this.financialInformation.setupBackupCpeCost;
    this.request.setupOtherDiscount = this.financialInformation.setupOtherDiscount;
    this.request.setupTotalCostTaxes = this.financialInformation.setupTotalCostTaxes;
    this.request.setupTotalCost = this.financialInformation.setupTotalCost;
    this.request.setupComments = this.financialInformation.setupComments;
    this.request.monthlyMainLlCost = this.financialInformation.monthlyMainLlCost;
    this.request.monthlyMainIpPortCost = this.financialInformation.monthlyMainIpPortCost;
    this.request.monthlyMainCpeCost = this.financialInformation.monthlyMainCpeCost;
    this.request.monthlyBackupLlCost = this.financialInformation.monthlyBackupLlCost;
    this.request.monthlyBackupIpPortCost = this.financialInformation.monthlyBackupIpPortCost;
    this.request.monthlyBackupCpeCost = this.financialInformation.monthlyBackupCpeCost;
    this.request.monthlyOtherDiscount = this.financialInformation.monthlyOtherDiscount;
    this.request.monthlyTotalCostTaxes = this.financialInformation.monthlyTotalCostTaxes;
    this.request.monthlyTotalCost = this.financialInformation.monthlyTotalCost;
    this.request.monthlyComments = this.financialInformation.monthlyComments;
    this.request.currency = this.financialInformation.currency;
  }

  private setRequestOperatorItemsDataToSubmit(request: Request): void {
    if (!this.operatorItems) {
      return;
    }
    let operatorItem: RequestOperatorItem;
    let operatorItemId: RequestOperatorItemsId;
    const requestOperatorItems: RequestOperatorItem[] = [];
    forEach(this.operatorItems, (value, key) => {
      operatorItemId = new RequestOperatorItemsId(request.id, key);
      operatorItem = new RequestOperatorItem(operatorItemId, value, request);
      requestOperatorItems.push(operatorItem);
    });
    this.requestOperatorItems = requestOperatorItems;
  }

  private setRequestItemsDataToSubmit(request: Request): void {
    let requestItem: RequestItem;
    const requestItems: RequestItem[] = [];
    let requestItemId: number;
    if (this.informationItems) {
      forEach(this.informationItems, (value, key) => {
        requestItemId = 0;
        requestItemId = this.getRequestItemIdFromLookup(key, 'INI');
        requestItem = new RequestItem(requestItemId, request, key, value, 'INI');
        requestItems.push(requestItem);
      });
    }

    if (this.setupCatalogOptions) {
      forEach(this.setupCatalogOptions, (value, key) => {
        requestItemId = 0;
        requestItemId = this.getRequestItemIdFromLookup(key, 'SCI');
        requestItem = new RequestItem(requestItemId, request, key, value, 'SCI');
        requestItems.push(requestItem);
      });
    }

    if (this.monthlyCatalogOptions) {
      forEach(this.monthlyCatalogOptions, (value, key) => {
        requestItemId = 0;
        requestItemId = this.getRequestItemIdFromLookup(key, 'MCI');
        requestItem = new RequestItem(requestItemId, request, key, value, 'MCI');
        requestItems.push(requestItem);
      });
    }
    this.requestItems = requestItems;
  }

  private setIspInfoDataToSubmit(request: Request): void {
    if (!this.showISPSection || !this.ispInfo || !request) {
      return;
    }
    this.ispInfo.request = request;
    this.ispInfo.requestId = request.id;
    this.ispInfo.ispCarrierId = this.ispInfo.ispCarrier ? this.ispInfo.ispCarrier.id : null;
  }

  private getRequestItemIdFromLookup(key: string, type: string): number {
    if (this.requestItemsLookup) {
      const reqItem = this.requestItemsLookup.find(itm => itm.name === key && itm.type === type);
      if (reqItem) {
        return reqItem.id;
      }
      return 0;
    }
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

  private setTelecomServiceDetailInEdit(req: Request) {
    if (!req) {
      return;
    }
    if (req.catalog) {
      this.catalogId = req.catalog.id;
    } else if (req.catalogId) {
      this.catalogId = req.catalogId;
    }
    this.telecomServiceDetailCurrent.id = req.serviceId;
    this.telecomServiceDetailCurrent.operator = req.opertors;
    this.telecomServiceDetailCurrent.catalogVersion = req.catalogVersion;
    this.telecomServiceDetailCurrent.serviceTitle = req.serviceTitle;
    this.telecomServiceDetailCurrent.optionsCSV = req.optionCodes;
    this.telecomServiceDetailCurrent.mainServiceCode = req.mainAccessCode;
    this.telecomServiceDetailCurrent.backupServiceCode = req.backupAccessCode;
    this.telecomServiceDetailCurrent.routerCode1 = req.routerCode1;
    this.telecomServiceDetailCurrent.routerCode2 = req.routerCode2;
  }

  private setSiteInfoInEdit(req: Request): void {
    this.siteInfo.siteCode = req.sgtSiteCode;
    this.siteInfo.siteName = req.site;
    this.siteInfo.sitePhone = req.siteFixPhone;
    this.siteInfo.siteAddress = req.address;
    this.siteInfo.siteZipCode = req.zipCode;
    this.siteInfo.siteCity = req.city;
    this.siteInfo.siteCountry = req.country;
  }

  private setCatalogInfoItemsDynamicControls(infoItems: CatalogInfoItems[]) {
    if (!infoItems || infoItems.length === 0) {
      this.catalogInfoItemsControls = [];
      return;
    }
    let textBox: TextboxDynamic;
    let dynamicControlOptions: DynamicControlOptions<string>;
    infoItems.forEach(element => {
      dynamicControlOptions = new DynamicControlOptions(DynamicControlType.number, '', element.name, element.name);
      textBox = new TextboxDynamic(dynamicControlOptions);
      this.catalogInfoItemsControls.push(textBox);
    });
  }

  private setCatalogInfoItemsDynamicControlsInEdit(requestId: number): void {
    this.sub$.add(
      this.requestService.getAllRequestItems(requestId).subscribe(res => {
        if (res) {
          let textBox: TextboxDynamic;
          let dynamicControlOptions: DynamicControlOptions<string>;
          this.requestItemsLookup = res;
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

  private setCatalogInfoItemsDynamicControlsInTermination(orderId: string): void {
    this.sub$.add(
      this.commandService.getAllOrderItems(orderId).subscribe(res => {
        if (res) {
          let textBox: TextboxDynamic;
          let dynamicControlOptions: DynamicControlOptions<string>;
          // this.orderItemsLookup = res;
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

  private setRequestStatus(): void {
    const eligibilityResponse: number = this.requestForm.get('eligibilityResponse').value;
    const operatorSDate: string = this.requestForm.get('operatorSDate').value;
    const operatorResponseDate: string = this.requestForm.get('operatorRDate').value;
    const autoValidation: boolean = this.requestForm.get('autoValidationOnOperator').value;
    let status: RequestStatus;
    const requestType: RequestType = this.requestForm.get('requestType').value;
    if (
      requestType === RequestType.Order ||
      requestType === RequestType.Termination ||
      requestType === RequestType.Device
    ) {
      status = RequestStatus.ValidatedToOrder;
    } else if (
      this.showEligibilityField &&
      eligibilityResponse === EligibilityResponse.NOT_USED &&
      operatorSDate &&
      operatorResponseDate
    ) {
      status = RequestStatus.QuotationNotUsed;
    } else if (operatorSDate && operatorResponseDate && autoValidation) {
      status = RequestStatus.ValidatedToOrder;
    } else if (operatorSDate && operatorResponseDate) {
      status = RequestStatus.ReadyToOrder;
    } else if (operatorSDate) {
      status = RequestStatus.Waiting_Operator_Response;
    } else {
      status = RequestStatus.Pending;
    }
    this.requestForm.patchValue({
      requestStatus: status
    });

    this.manageActions(status, this.data.mode);
  }

  private setChargeback(): void {
    if (!this.chargebackSelected) {
      this.requestForm.patchValue({
        selectedChargeback: null
      });
      return;
    }
    this.requestForm.patchValue({
      selectedChargeback:
        this.chargebackSelected.label +
        ' || ' +
        this.chargebackSelected.sapAccount +
        ' || ' +
        this.chargebackSelected.sif
    });
  }

  private getAllOperatorParameters(operatorId: number): void {
    if (!operatorId) {
      return;
    }
    this.isLoading = true;
    const operatorParameterFilter: OperatorParameterDTO = new OperatorParameterDTO();
    operatorParameterFilter.operator.id = operatorId;
    if (this.requestForm.get('requestType').value === RequestType.Order) {
      operatorParameterFilter.type = 'O';
    } else {
      operatorParameterFilter.type = 'R';
    }
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

  private setOperatorParameterDynamicControlsInEdit(requestId: number): void {
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

  private setOperatorParameterDynamicControlsInTerminate(orderId: string): void {
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

  private setIspInfoInEdit(req: Request): void {
    if (!req) {
      return;
    }
    this.sub$.add(
      this.ispBandwidthService.getIspInformationByRequest(req.id).subscribe(res => {
        if (res) {
          this.ispInfo = res;
          this.ispInfo.request = req;
          this.ispInfo.requestId = req.id;
        }
      })
    );
  }

  private setAction(actionId: number): void {
    this.isLoading = true;
    this.sub$.add(
      this.actionService
        .getAllActions(0, 1, '', 'asc', '')
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Action>) => {
          if (page) {
            this.requestForm.patchValue({
              action: page.content.find(act => act.id === actionId)
            });
          }
        })
    );
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

  private setFinancialInformationInEdit(req: Request): void {
    if (!req) {
      return;
    }
    const finInfo: FinancialInformation = new FinancialInformation();

    finInfo.currency = req.currency;

    finInfo.setupMainLlCost = req.setupMainLlCost;
    finInfo.setupMainIpPortCost = req.setupMainIpPortCost;
    finInfo.setupMainCpeCost = req.setupMainCpeCost;
    finInfo.setupBackupLlCost = req.setupBackupLlCost;
    finInfo.setupBackupIpPortCost = req.setupBackupIpPortCost;
    finInfo.setupBackupCpeCost = req.setupBackupCpeCost;
    finInfo.setupTotalCost = req.setupTotalCost;
    finInfo.setupOtherDiscount = req.setupOtherDiscount;
    finInfo.setupTotalCostTaxes = req.setupTotalCostTaxes;
    finInfo.setupComments = req.setupComments;

    finInfo.monthlyMainLlCost = req.monthlyMainLlCost;
    finInfo.monthlyMainIpPortCost = req.monthlyMainIpPortCost;
    finInfo.monthlyMainCpeCost = req.monthlyMainCpeCost;
    finInfo.monthlyBackupLlCost = req.monthlyBackupLlCost;
    finInfo.monthlyBackupIpPortCost = req.monthlyBackupIpPortCost;
    finInfo.monthlyBackupCpeCost = req.monthlyBackupCpeCost;
    finInfo.monthlyTotalCost = req.monthlyTotalCost;
    finInfo.monthlyOtherDiscount = req.monthlyOtherDiscount;
    finInfo.monthlyTotalCostTaxes = req.monthlyTotalCostTaxes;
    finInfo.monthlyComments = req.monthlyComments;

    this.financialInformation = finInfo;
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

  private getPreviousOrder(caller: string): void {
    if (
      !this.selectedNetwork ||
      !this.selectedNetwork.id ||
      !this.siteInfo ||
      !this.siteInfo.siteCode ||
      !this.requestForm.get('serviceNumber').value
    ) {
      this.requestForm.patchValue({
        previousOrderId: null
      });
      return;
    }
    this.isPreviousOrderLoading = true;
    this.lastOrder = null;
    this.sub$.add(
      this.commandService
        .getPreviousCommandByByNetworkAndSiteCodeAndServiceNumber(
          this.selectedNetwork.id,
          this.siteInfo.siteCode,
          this.requestForm.get('serviceNumber').value
        )
        .pipe(
          finalize(() => {
            this.isPreviousOrderLoading = false;
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

  private setContactInfoInEdit(req: Request): void {
    if (!req) {
      return;
    }
    this.installationContact1.firstName = req.localContact1FirstName;
    this.installationContact1.name = req.localContact1LastName;
    this.installationContact1.fixPhone = req.localContact1Phone;
    this.installationContact1.mobilePhone = req.localContact1Mobile;
    this.installationContact1.email = req.localContact1Email;

    this.installationContact2.firstName = req.localContact2FirstName;
    this.installationContact2.name = req.localContact2LastName;
    this.installationContact2.fixPhone = req.localContact2Phone;
    this.installationContact2.mobilePhone = req.localContact2Mobile;
    this.installationContact2.email = req.localContact2Email;
  }

  private setPreviousOrderInfo(command: Commands, caller: string): void {
    if (!command) {
      this.requestForm.patchValue({
        previousOrderId: this.translateService.instant('common.notFound')
      });
      if (caller) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          disableClose: true,
          data: this.translateService.instant('request.make.previousOrder.notFound.message')
        });
        dialogRef.afterClosed().subscribe(result => {
          if (!result) {
            if (caller === 'network') {
              this.requestForm.patchValue({
                network: null
              });
            } else if (caller === 'site') {
              this.siteInfo = new SiteInfo();
              this.isSiteReset = true;
            } else if (caller === 'serviceNumber') {
              this.requestForm.patchValue({
                serviceNumber: null
              });
            }
            this.requestForm.patchValue({
              previousOrderId: null
            });
          }
        });
      }
      return;
    }
    if (this.data && this.data.mode === 'add') {
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

    this.requestForm.patchValue({
      previousOrderId: command.orderId
    });
  }

  private getAllNetworks(): void {
    if (!this.operatorId) {
      return;
    }
    this.isLoading = true;
    const networkFilter: NetworksFilter = new NetworksFilter();
    networkFilter.operatorId = this.operatorId;
    this.sub$.add(
      this.networkService
        .getAllNetworks('', 0, 200, 'name', 'asc', networkFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Networks>) => {
          if (page) {
            this.networks = page.content;
          }
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
            const acnFilter: AcnParameterDTO = new AcnParameterDTO();
            acnFilter.network = res.content[0];
            this.getACNParameters(acnFilter);
            this.getPreviousOrder('');
            this.requestForm.patchValue({
              network: res.content[0]
            });
          }
        })
      );
    }
  }

  private setChargebackById(id: number): void {
    if (id) {
      this.chargebackService.url = '/tempo/chargebacks';
      this.sub$.add(
        this.chargebackService.getChargebackById(id).subscribe(res => {
          if (res) {
            this.chargebackSelected = res;
            this.setChargeback();
          }
        })
      );
    }
  }

  private checkCRDValid(crdDate: Date, ltcCommitment: number): void {
    if (!crdDate) {
      return;
    }
    if (!ltcCommitment) {
      ltcCommitment = 0;
    }

    const tday: Date = new Date();

    const date1: number = tday.setDate(tday.getDate() + ltcCommitment);
    const date2 = crdDate.setDate(crdDate.getDate());
    if (date2 < date1) {
      this.messageService.showWithAction(
        this.translateService.instant('request.make.crd.warning.message'),
        true,
        'warning'
      );
      this.requestForm.patchValue({
        customerRequestedDate: null
      });
    }
  }

  private manageActions(requestStatus: number, mode: string): void {
    if (!requestStatus && !mode) {
      return;
    }

    const requestType: RequestType = this.requestForm.get('requestType').value;

    if (mode === 'add') {
      this.showCancel = false;
      this.showValidateToOrder = false;
      this.showOrderThisRequest = false;
      this.showServiceChange = false;
    } else if (mode === 'termination') {
      this.showSave = true;
      this.showCancel = false;
      this.showServiceFreeFill = false;
      this.showISPSave = false;
      this.showValidateToOrder = false;
      this.showOrderThisRequest = false;
      this.showServiceChange = false;
    } else if (mode === 'edit') {
      if (
        requestType === RequestType.Order ||
        requestType === RequestType.Termination ||
        requestType === RequestType.Device
      ) {
        if (requestStatus === RequestStatus.Ordered || requestStatus === RequestStatus.Cancelled) {
          this.showCloseOnly();
          if (requestStatus === RequestStatus.Cancelled) {
            this.showISPSave = false;
          }
        } else if (requestStatus === RequestStatus.ValidatedToOrder) {
          this.showValidateToOrder = false;
          if (requestType === RequestType.Termination) {
            this.showSendCSV = false;
            this.showServiceFreeFill = false;
            this.showServiceChange = false;
          }
        } else {
          this.showMainAction = false;
        }
      } else {
        if (requestStatus === RequestStatus.Ordered || requestStatus === RequestStatus.Cancelled) {
          this.showCloseOnly();
          if (requestStatus === RequestStatus.Cancelled) {
            this.showISPSave = false;
          }
        } else {
          if (requestStatus === RequestStatus.ValidatedToOrder) {
            this.showValidateToOrder = false;
          } else if (requestStatus === RequestStatus.ReadyToOrder) {
            this.showOrderThisRequest = false;
            if (requestType === RequestType.Eligibility || requestType === RequestType.Eligibility_Quotation) {
              const eligibilityResponse: string = this.requestForm.get('eligibilityResponse').value;
              if (eligibilityResponse === 'OK') {
                this.showValidateToOrder = true;
              } else {
                this.showValidateToOrder = false;
              }
            } else {
              this.showValidateToOrder = true;
            }
          } else {
            this.showOrderThisRequest = false;
            this.showValidateToOrder = false;
          }
        }
      }
    }
  }

  private showCloseOnly(): void {
    this.showMainAction = false;
  }

  private setItManagerBySiteCode(siteCode: string): void {
    if (siteCode) {
      this.siteService.url = '/sirene/sites';
      this.isITManagerLoading = true;
      this.sub$.add(
        this.siteService
          .getSiteById(siteCode)
          .pipe(finalize(() => (this.isITManagerLoading = false)))
          .subscribe(site => {
            if (site) {
              this.requestForm.patchValue({
                itManager: site.itManager ? site.itManager.fullName : ''
              });
            }
          })
      );
    }
  }
}
