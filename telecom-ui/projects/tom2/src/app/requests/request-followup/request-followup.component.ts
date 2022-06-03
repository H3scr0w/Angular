import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import toNumber from 'lodash/toNumber';
import { of, Observable, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  flatMap,
  map,
  startWith,
  switchMap
} from 'rxjs/operators';
import {
  Company,
  CompanyFilter,
  CompanyService,
  Country,
  CountryFilter,
  CountryService,
  Sector,
  SectorService,
  Zone,
  ZoneFilter,
  ZoneService
} from '../../../../../sirene/src/app/shared';
import { Contact, ContactFilter } from '../../../../../sirene/src/app/shared/models/contact';
import { Profile } from '../../../../../sirene/src/app/shared/models/profile';
import { ContactService } from '../../../../../sirene/src/app/shared/services/contact/contact.service';
import { AuthenticationService } from '../../core';
import { EmailPreviewDialogComponent } from '../../orders/email-preview-dialog/email-preview-dialog.component';
import { MultiEmailPreviewDialogComponent } from '../../orders/multi-email-preview-dialog/multi-email-preview-dialog.component';
import { IOrderResultData } from '../../orders/order-make/order-make-dialog/order-make-dialog-data';
import { OrderMakeDialogComponent } from '../../orders/order-make/order-make-dialog/order-make-dialog.component';
import { OrderNotifyDialogComponent } from '../../orders/order-make/order-notify-dialog/order-notify-dialog.component';
import { BillingEntity, RequestAction, RequestStatus, RequestType } from '../../shared/enums/enum';
import { CommandsDTO } from '../../shared/models/commands';
import { EmailPreviewDialogDetails } from '../../shared/models/email-preview-dialog-details';
import { KeyValue } from '../../shared/models/key-value';
import { Operator } from '../../shared/models/operators';
import { Page } from '../../shared/models/page.model';
import { Queues } from '../../shared/models/queues';
import { Request, RequestFilter } from '../../shared/models/request';
import { MessageService } from '../../shared/service/message/message.service';
import { OperatorsService } from '../../shared/service/operators/operators.service';
import { QueuesService } from '../../shared/service/queues/queues.service';
import { RequestService } from '../../shared/service/request/request.service';
import { UtilService } from '../../shared/service/util/util.service';
import { RequestResultDialogData } from '../request-make/request-make-dialog/request-make-dialog-data';
import { RequestMakeDialogComponent } from '../request-make/request-make-dialog/request-make-dialog.component';

@Component({
  selector: 'stgo-request-followup',
  templateUrl: './request-followup.component.html',
  styleUrls: ['./request-followup.component.scss']
})
export class RequestFollowupComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  filterCount = 0;
  searchValue: string;
  totalElements: number;
  requests: Request[] = [];
  command: CommandsDTO;
  advanceFilter: RequestFilter;
  displayedColumns: string[] = [
    'select',
    'requestId',
    'requestType',
    'status',
    'priority',
    'operator',
    'requester',
    'siteName',
    'serviceTitle',
    'mainServiceCode',
    'backupServiceCode',
    'options',
    'setupCost',
    'monthlyCost',
    'currency',
    'actions'
  ];
  panelFilterOpenState = true;
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;
  isRequesterUser: boolean;
  requestList: Observable<Request[]>;
  operators: Operator[];
  statuses: Queues[];
  requestTypes: Queues[];
  rsms: Observable<Contact[]>;
  requesters: Contact[];
  sectors: Observable<Sector[]>;
  countries: Country[];
  zones: Zone[];
  companies: Company[];
  request: Request;
  selection = new SelectionModel<Request>(true, []);
  emailPreviewData: EmailPreviewDialogDetails = { mode: 'request', orderId: [], requestId: [] };
  priorities: KeyValue[];
  showSelectAllCheckbox = false;
  requestAllowToSelect: Request[] = [];
  requestTypeListForChecbox: number[] = [
    RequestType.Quotation,
    RequestType.Eligibility,
    RequestType.Eligibility_Quotation
  ];
  requestStatusListChecbox: number[] = [RequestStatus.Ordered, RequestStatus.Cancelled];

  requestFollowUpFilterForm = this.fb.group({
    requestId: [''],
    requestTypeId: [null],
    operatorId: [null],
    status: [null],
    rsmId: [null],
    requesterId: [null],
    sectorId: [null],
    zoneId: [null],
    companyId: [null],
    priority: [null],
    sgtSiteCode: [''],
    country: [null]
  });
  inputRequestId: Subject<string> = new Subject<string>();
  inputOperator: Subject<string> = new Subject<string>();
  inputStatus: Subject<string> = new Subject<string>();
  inputSector: Subject<string> = new Subject<string>();
  inputZone: Subject<string> = new Subject<string>();
  inputCompany: Subject<string> = new Subject<string>();
  inputCountry: Subject<string> = new Subject<string>();
  inputRsm: Subject<string> = new Subject<string>();
  inputRequester: Subject<string> = new Subject<string>();
  private filter: Subject<string> = new Subject();
  private sub$: Subscription = new Subscription();

  constructor(
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private requestService: RequestService,
    private operatorsService: OperatorsService,
    private sectorService: SectorService,
    private zoneService: ZoneService,
    private companyService: CompanyService,
    private contactService: ContactService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private queuesService: QueuesService,
    private utilService: UtilService,
    private countryService: CountryService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;
    this.isRequesterUser = this.authenticationService.credentials.isRequesterUser;
    this.isPmUser = this.authenticationService.credentials.isPmUser;
    this.priorities = this.requestService.getPriorities();

    this.sub$.add(
      this.route.paramMap.subscribe(params => {
        if (params && params.has('id')) {
          this.requestService
            .getRequestById(toNumber(params.get('id')))
            .pipe(
              flatMap((request: Request) => {
                return this.operatorsService.getOperatorById(request.operatorsId).pipe(
                  map((operator: Operator) => {
                    request.opertors = operator;
                    return request;
                  })
                );
              })
            )
            .subscribe((result: Request) => {
              if (result) {
                this.editRequest(result);
              }
            });
        }
      })
    );

    this.sub$.add(
      this.filter
        .pipe(
          filter(value => value && value.trim().length > 1),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe(searchTextValue => {
          this.pageIndex = 0;
          this.searchValue = searchTextValue.trim();
          this.resetAdvanceFilter();
        })
    );

    this.requestList = this.inputRequestId.pipe(
      startWith(''),
      filter(value => value && value.trim().length > 3),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.requestService.getAllRequests(value.trim(), 0, 50).pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.inputOperator.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.getAllOperators(value);
    });

    this.statuses = this.queuesService.getRequestQueues();
    this.requestTypes = this.queuesService.getRequestTypesQueues();

    this.sectorService.url = '/sirene/sectors';
    this.sectors = this.inputSector.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.sectorService.getAllSectors(value, 0, 50, 'name', 'asc').pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.countryService.url = '/sirene/countries';
    this.inputCountry.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.getAllCountries(value);
    });

    this.zoneService.url = '/sirene/zones';
    this.inputZone.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.getAllZones(value);
    });

    this.companyService.url = '/sirene/companies';
    this.inputCompany.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.getAllCompanies(value);
    });

    this.inputRequester.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.getAllCommandsRequesters();
    });

    this.rsms = this.inputRsm.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        const contactFilter: ContactFilter = new ContactFilter();
        const profile: Profile = new Profile();
        profile.name = 'SGT RSM';
        contactFilter.profile = profile;
        return this.contactService.getAllContacts(0, 200, 'firstName', 'asc', value, contactFilter).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.fullName.localeCompare(b.fullName)));
          })
        );
      })
    );
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllRequests(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllRequests(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.requestAllowToSelect.length != null ? this.requestAllowToSelect.length : 0;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.requestAllowToSelect.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Request) {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  csvFileSendToOperator(): void {
    const requestIds: number[] = this.selection.selected.map(request => request.id);
    if (requestIds) {
      const emailPreviewData: EmailPreviewDialogDetails = { mode: 'request', orderId: [], requestId: [] };
      emailPreviewData.requestId.push(...requestIds);
      this.dialog.open(MultiEmailPreviewDialogComponent, {
        width: '1000px',
        disableClose: true,
        data: emailPreviewData
      });
    }
  }

  countAdvanceFilter(requestFilter: RequestFilter): void {
    this.filterCount = 0;
    if (requestFilter) {
      if (requestFilter.requestId) {
        this.filterCount++;
      }
      if (requestFilter.operatorId) {
        this.filterCount++;
      }
      if (requestFilter.status === 0 || requestFilter.status) {
        this.filterCount++;
      }
      if (requestFilter.rsmId) {
        this.filterCount++;
      }
      if (requestFilter.requesterId) {
        this.filterCount++;
      }
      if (requestFilter.sectorId) {
        this.filterCount++;
      }
      if (requestFilter.zoneId) {
        this.filterCount++;
      }
      if (requestFilter.companyId) {
        this.filterCount++;
      }
      if (requestFilter.country) {
        this.filterCount++;
      }
      if (requestFilter.priority) {
        this.filterCount++;
      }
      if (requestFilter.requestTypeId) {
        this.filterCount++;
      }
      if (requestFilter.sgtSiteCode) {
        this.filterCount++;
      }
    }
  }

  resetAdvanceFilter(): void {
    this.advanceFilter = null;
    this.requests = [];
    this.selection.clear();
    this.requestFollowUpFilterForm.reset();
    this.getAllZones();
    this.getAllCompanies();
    this.countAdvanceFilter(null);
    this.getAllRequests(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  applyFilter(filterValue: string): void {
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = null;
    }
    this.filter.next(this.searchValue);
  }

  applyAdvanceFilter(): void {
    this.advanceFilter = Object.assign({}, this.requestFollowUpFilterForm.value);
    this.advanceFilter.zoneId =
      this.requestFollowUpFilterForm.controls.zoneId.value != null
        ? this.requestFollowUpFilterForm.controls.zoneId.value.id
        : '';
    this.advanceFilter.sectorId =
      this.requestFollowUpFilterForm.controls.sectorId.value != null
        ? this.requestFollowUpFilterForm.controls.sectorId.value.id
        : '';

    this.pageIndex = 0;
    this.searchValue = null;
    this.pageIndex = 0;
    this.countAdvanceFilter(this.advanceFilter);
    if (this.filterCount > 0) {
      this.getAllRequests(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
    } else {
      this.messageService.show(this.translateService.instant('common.advance.filter.msg'), 'error');
    }
  }

  onRequestTypeSelected(requestType: Queues): void {
    if (requestType) {
      if (requestType.id === RequestType.Order || requestType.id === RequestType.Termination) {
        this.statuses = this.queuesService
          .getRequestQueues()
          .filter(
            status =>
              status.id === RequestStatus.ValidatedToOrder ||
              status.id === RequestStatus.Ordered ||
              status.id === RequestStatus.Cancelled
          );
      } else if (requestType.id === RequestType.Device) {
        this.statuses = [];
      } else {
        this.statuses = this.queuesService.getRequestQueues();
      }

      const statusId: RequestStatus = this.requestFollowUpFilterForm.get('status').value;
      if (statusId && !this.statuses.map(status => status.id).includes(statusId)) {
        this.requestFollowUpFilterForm.patchValue({
          status: null
        });
      }
    }
  }

  onSectorSelected(sector: Sector): void {
    if (sector) {
      this.requestFollowUpFilterForm.patchValue({
        zoneId: null,
        companyId: null
      });
    }
    this.getAllZones();
    this.getAllCompanies();
  }

  onZoneSelected(zone: Zone): void {
    if (zone) {
      this.requestFollowUpFilterForm.patchValue({
        sectorId: zone.sector,
        companyId: null
      });
    }
    this.getAllCompanies();
  }

  onCompanySelected(company: Company): void {
    if (company) {
      this.requestFollowUpFilterForm.patchValue({
        sectorId: company.zone.sector,
        zoneId: company.zone
      });
    }
  }

  editRequest(req: Request): void {
    if (!req) {
      return;
    }
    const dialogRef = this.dialog.open(RequestMakeDialogComponent, {
      width: '1000px',
      data: { mode: 'edit', request: req },
      disableClose: true,
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close' && result) {
        const requestResult: RequestResultDialogData = result;
        this.getAllRequests(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);

        if (requestResult.action === 'orderThisRequest') {
          this.setCommandDataToOrderThisRequest(requestResult.request);

          const dialogRefOrder = this.dialog.open(OrderMakeDialogComponent, {
            width: '1000px',
            data: { mode: 'convert', order: this.command },
            disableClose: true,
            hasBackdrop: false
          });
          dialogRefOrder.afterClosed().subscribe(res => {
            if (res !== 'close' && res) {
              const orderResult: IOrderResultData = res;
              if (orderResult.isAnyError) {
                this.messageService.showWithAction(
                  this.translateService.instant('order.make.success.partially.message', {
                    orderId: orderResult.orderId
                  })
                );
              } else {
                this.messageService.showWithAction(
                  this.translateService.instant('order.make.success.message', { orderId: orderResult.orderId })
                );
              }
              this.updateRequestStatus(requestResult.request, RequestStatus.Ordered);
              if (requestResult.request.notify === '1') {
                this.orderNotify(orderResult.orderId);
              }
            }
          });
        }
      }
    });
  }

  emailPreview(data: Request): void {
    this.emailPreviewData.mode = 'request';
    this.emailPreviewData.requestId.push(data.id);
    const dialogRef = this.dialog.open(EmailPreviewDialogComponent, {
      width: '700px',
      disableClose: true,
      data: this.emailPreviewData
    });
    dialogRef.afterClosed().subscribe(result => {
      this.emailPreviewData.requestId = [];
      if (result !== 'close') {
      }
    });
  }

  downloadCSV(data: Request): void {
    if (data) {
      this.isLoading = true;
      this.sub$.add(
        this.requestService
          .download(data.id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((csvContent: Blob) => {
            if (csvContent) {
              const blob = new Blob([csvContent], { type: 'application/octet-stream' });
              saveAs(blob, data.id + '.csv');
            }
          })
      );
    }
  }

  private getAllOperators(value: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.operatorsService
        .getAllOperators(0, 50, 'name', 'asc', value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Operator>) => {
          if (page) {
            this.operators = page.content.sort((a, b) => a.name.localeCompare(b.name));
          }
        })
    );
  }

  private getAllCompanies(searchValue?: string): void {
    this.isLoading = true;
    const companyFilter: CompanyFilter = new CompanyFilter();
    companyFilter.sector = this.requestFollowUpFilterForm.controls.sectorId.value;
    companyFilter.zone = this.requestFollowUpFilterForm.controls.zoneId.value;
    if (searchValue) {
      companyFilter.companyName = searchValue;
    }
    companyFilter.skip = true;
    this.sub$.add(
      this.companyService
        .getAllCompanies('', 0, 50, 'name', 'asc', companyFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Company>) => {
          if (page) {
            this.companies = page.content.sort((a, b) => a.companyName.localeCompare(b.companyName));
          }
        })
    );
  }

  private getAllCountries(searchValue?: string): void {
    this.isLoading = true;
    const countryFilter: CountryFilter = new CountryFilter();
    countryFilter.skip = true;
    if (searchValue) {
      countryFilter.name = searchValue;
    }
    this.sub$.add(
      this.countryService
        .getAllCountries('', 0, 100, 'name', 'asc', countryFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Country>) => {
          if (page) {
            this.countries = page.content.sort((a, b) => a.name.localeCompare(b.name));
          }
        })
    );
  }

  private getAllZones(searchValue?: string): void {
    this.isLoading = true;
    const zoneFilter: ZoneFilter = new ZoneFilter();
    zoneFilter.sector = this.requestFollowUpFilterForm.controls.sectorId.value;
    if (searchValue) {
      zoneFilter.name = searchValue;
    }
    this.sub$.add(
      this.zoneService
        .getAllZones('', 0, 100, '', 'name', 'asc', zoneFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Zone>) => {
          if (page) {
            this.zones = page.content.sort((a, b) => a.name.localeCompare(b.name));
          }
        })
    );
  }

  private getAllCommandsRequesters(): void {
    this.isLoading = true;
    this.sub$.add(
      this.requestService
        .getAllRequesters()
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((contact: Contact[]) => {
          if (contact) {
            this.requesters = contact.sort((a, b) => a.fullName.localeCompare(b.fullName));
          }
        })
    );
  }

  private getAllRequests(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    advancefilter?: RequestFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.requestService
        .getAllRequests(search, this.pageIndex, this.pageSize, sortField, sortDirection, advancefilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Request>) => {
          if (this.selection.selected.length > 0) {
            this.selection.clear();
          }

          if (page) {
            this.requests = page.content;

            if (this.requests) {
              this.requestAllowToSelect = this.requests
                .filter(request => !this.requestStatusListChecbox.includes(request.requestStatus?.id))
                .filter(request => this.requestTypeListForChecbox.includes(request.requestType?.id));

              this.showSelectAllCheckbox = this.requestAllowToSelect.length > 0;
            } else {
              this.showSelectAllCheckbox = false;
            }

            this.requests.map(request => {
              return this.operators.forEach(operators => {
                if (request.operatorsId === operators.id) {
                  request.opertors = operators;
                }
              });
            });
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }

  private setCommandDataToOrderThisRequest(req: Request): void {
    if (!req) {
      return;
    }
    this.command = new CommandsDTO();
    // Reference
    this.command.action.id = RequestAction.Creation;
    this.command.network = req.network;
    this.command.serviceNumber = req.serviceNumber;
    this.command.requestId = req.id;
    this.command.priority = req.priority;
    this.command.replaced = req.replaced;
    this.command.ownerId = req.ownerId;
    this.command.creationDate = req.creationDate;
    this.command.lastUpdate = req.lastUpdate;
    this.command.lastUser = req.lastUser;

    // Follow-up
    const ltcCommitment: number = req.ltcCommitment ? req.ltcCommitment : 0;
    this.command.dateCrd = req.dcrd;
    this.command.dateCcd = this.utilService.addDaysInDate(new Date(), ltcCommitment);
    this.command.pdfComments = req.comments;

    // Site Info
    this.command.sgtSiteCode = req.sgtSiteCode;
    this.command.site = req.site;
    this.command.siteFixPhone = req.siteFixPhone;
    this.command.address = req.address;
    this.command.zipCode = req.zipCode;
    this.command.city = req.city;
    this.command.country = req.country;

    // Misc
    this.command.managementMode = req.managementMode;
    this.command.financialEntityId = BillingEntity.SGT;
    this.command.acnParameter = req.acnParameter;

    // Installation Contacts
    this.command.localContact1FirstName = req.localContact1FirstName;
    this.command.localContact1LastName = req.localContact1LastName;
    this.command.localContact1Phone = req.localContact1Phone;
    this.command.localContact1Mobile = req.localContact1Mobile;
    this.command.localContact1Email = req.localContact1Email;
    this.command.localContact1FirstName = req.localContact1FirstName;

    this.command.localContact2FirstName = req.localContact2FirstName;
    this.command.localContact2LastName = req.localContact2LastName;
    this.command.localContact2Phone = req.localContact2Phone;
    this.command.localContact2Mobile = req.localContact2Mobile;
    this.command.localContact2Email = req.localContact2Email;
    this.command.localContact2FirstName = req.localContact2FirstName;

    // Telecom Service
    this.command.operatorDto = req.opertors;
    this.command.catalogId = req.catalog.id;
    this.command.catalogVersion = req.catalogVersion;
    this.command.serviceTitle = req.serviceTitle;
    this.command.mainAccessCode = req.mainAccessCode;
    this.command.backupAccessCode = req.backupAccessCode;
    this.command.optionCodes = req.optionCodes;
    this.command.routerCode1 = req.routerCode1;
    this.command.routerCode2 = req.routerCode2;

    // SLA Info
    this.command.gtrCommitment = req.gtrCommitment;
    this.command.dispoCommitment = req.dispoCommitment;
    this.command.ltcCommitment = req.ltcCommitment;

    // Information Items
    // Handled in Order form

    // Operator Items
    // Handled in Order form

    // ISP Info
    // Handled in order form

    // Financial Information
    this.command.currency = req.currency;
    this.command.setupMainLlCost = req.setupMainLlCost ? req.setupMainLlCost.toString() : '0';
    this.command.setupMainIpPortCost = req.setupMainIpPortCost ? req.setupMainIpPortCost.toString() : '0';
    this.command.setupMainCpeCost = req.setupMainCpeCost ? req.setupMainCpeCost.toString() : '0';
    this.command.setupBackupLlCost = req.setupBackupLlCost ? req.setupBackupLlCost.toString() : '0';
    this.command.setupBackupIpPortCost = req.setupBackupIpPortCost ? req.setupBackupIpPortCost.toString() : '0';
    this.command.setupBackupCpeCost = req.setupBackupCpeCost ? req.setupBackupCpeCost.toString() : '0';
    this.command.setupTotalCost = req.setupTotalCost ? req.setupTotalCost.toString() : '0';
    this.command.setupOtherDiscount = req.setupOtherDiscount ? req.setupOtherDiscount.toString() : '0';
    this.command.setupTotalCostTaxes = req.setupTotalCostTaxes ? req.setupTotalCostTaxes.toString() : '0';
    this.command.setupComments = req.setupComments ? req.setupComments : '';

    this.command.monthlyMainLlCost = req.monthlyMainLlCost ? req.monthlyMainLlCost.toString() : '0';
    this.command.monthlyMainIpPortCost = req.monthlyMainIpPortCost ? req.monthlyMainIpPortCost.toString() : '0';
    this.command.monthlyMainCpeCost = req.monthlyMainCpeCost ? req.monthlyMainCpeCost.toString() : '0';
    this.command.monthlyBackupLlCost = req.monthlyBackupLlCost ? req.monthlyBackupLlCost.toString() : '0';
    this.command.monthlyBackupIpPortCost = req.monthlyBackupIpPortCost ? req.monthlyBackupIpPortCost.toString() : '0';
    this.command.monthlyBackupCpeCost = req.monthlyBackupCpeCost ? req.monthlyBackupCpeCost.toString() : '0';
    this.command.monthlyTotalCost = req.monthlyTotalCost ? req.monthlyTotalCost.toString() : '0';
    this.command.monthlyOtherDiscount = req.monthlyOtherDiscount ? req.monthlyOtherDiscount.toString() : '0';
    this.command.monthlyTotalCostTaxes = req.monthlyTotalCostTaxes ? req.monthlyTotalCostTaxes.toString() : '0';
    this.command.monthlyComments = req.monthlyComments ? req.monthlyComments : '';
  }

  private orderNotify(orderId: string): void {
    const dialogRef = this.dialog.open(OrderNotifyDialogComponent, {
      width: '820px',
      disableClose: true,
      data: orderId
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.messageService.show(this.translateService.instant('common.save.success.mail'));
      }
    });
  }

  private updateRequestStatus(request: Request, status: RequestStatus): void {
    if (!request || !status || this.isLoading) {
      return;
    }
    this.isLoading = true;
    request.requestStatus.id = status;
    this.sub$.add(
      this.requestService
        .editRequest(request)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          if (res) {
            this.getAllRequests(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
          }
        })
    );
  }
}
