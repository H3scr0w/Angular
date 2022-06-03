import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, startWith, switchMap } from 'rxjs/operators';
import {
  Company,
  CompanyFilter,
  CompanyService,
  Sector,
  SectorService,
  SiteBackbone,
  Zone,
  ZoneFilter,
  ZoneService
} from '../../../../../sirene/src/app/shared';
import { Contact, ContactFilter } from '../../../../../sirene/src/app/shared/models/contact';
import { Profile } from '../../../../../sirene/src/app/shared/models/profile';
import { ContactService } from '../../../../../sirene/src/app/shared/services/contact/contact.service';
import { AuthenticationService } from '../../core';
import { CommandsDTO, CommandsFilter } from '../../shared/models/commands';
import { EmailPreviewDialogDetails } from '../../shared/models/email-preview-dialog-details';
import { Operator } from '../../shared/models/operators';
import { Page } from '../../shared/models/page.model';
import { Queues } from '../../shared/models/queues';
import { CommandService } from '../../shared/service/commands/command.service';
import { MessageService } from '../../shared/service/message/message.service';
import { OperatorsService } from '../../shared/service/operators/operators.service';
import { QueuesService } from '../../shared/service/queues/queues.service';
import { EmailPreviewDialogComponent } from '../email-preview-dialog/email-preview-dialog.component';
import { MultiEmailPreviewDialogComponent } from '../multi-email-preview-dialog/multi-email-preview-dialog.component';
import { IOrderResultData } from '../order-make/order-make-dialog/order-make-dialog-data';
import { OrderMakeDialogComponent } from '../order-make/order-make-dialog/order-make-dialog.component';
import { OrderNotifyDialogComponent } from '../order-make/order-notify-dialog/order-notify-dialog.component';

@Component({
  selector: 'stgo-followup',
  templateUrl: './followup.component.html',
  styleUrls: ['./followup.component.scss']
})
export class FollowupComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  advanceFilter: CommandsFilter;
  isLoading = false;
  filterCount = 0;
  searchValue: string;
  totalElements: number;
  commands: CommandsDTO[] = [];
  displayedColumns: string[] = [
    'select',
    'orderId',
    'action',
    'operator',
    'status',
    'requester',
    'siteName',
    'serviceTitle',
    'mainServiceCode',
    'backupServiceCode',
    'options',
    'setupCost',
    'monthlyCost',
    'currency',
    'sendingDateToOperator',
    'operatorAckDate',
    'doStatus',
    'startOfBilling',
    'actions'
  ];
  panelFilterOpenState = true;
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;
  isRequesterUser: boolean;
  operators: Operator[];
  statuses: Queues[];
  rsms: Observable<Contact[]>;
  requesters: Contact[];
  sectors: Observable<Sector[]>;
  zones: Zone[];
  companies: Company[];
  emailPreviewData: EmailPreviewDialogDetails = { mode: 'order', orderId: [], requestId: [] };
  selection = new SelectionModel<CommandsDTO>(true, []);

  orderFollowUpFilterForm = this.fb.group({
    orderId: [''],
    requestId: [''],
    operatorId: [null],
    status: [null],
    rsmId: [null],
    requesterId: [null],
    sectorId: [null],
    zoneId: [null],
    companyId: [null],
    mainServiceCode: [''],
    backupServiceCode: [''],
    lastOrderId: [''],
    lastFullyAcceptedOrderID: [''],
    backbone: [null]
  });

  backbones: SiteBackbone[] = [
    { id: 1, name: 'Only' },
    { id: 0, name: 'Excluded' }
  ];

  inputOrderId: Subject<string> = new Subject<string>();
  inputOperator: Subject<string> = new Subject<string>();
  inputStatus: Subject<string> = new Subject<string>();
  inputSector: Subject<string> = new Subject<string>();
  inputZone: Subject<string> = new Subject<string>();
  inputCompany: Subject<string> = new Subject<string>();
  inputRsm: Subject<string> = new Subject<string>();
  inputRequester: Subject<string> = new Subject<string>();
  private filter: Subject<string> = new Subject();
  private sub$: Subscription = new Subscription();

  constructor(
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private commandService: CommandService,
    private operatorsService: OperatorsService,
    private queuesService: QueuesService,
    private sectorService: SectorService,
    private zoneService: ZoneService,
    private companyService: CompanyService,
    private contactService: ContactService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;
    this.isRequesterUser = this.authenticationService.credentials.isRequesterUser;
    this.isPmUser = this.authenticationService.credentials.isPmUser;

    this.sub$.add(
      this.route.paramMap.subscribe(params => {
        if (params && params.has('orderId')) {
          this.isLoading = true;
          this.commandService
            .getOrderByOrderId(params.get('orderId'))
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(result => {
              if (result) {
                this.orderDetails(result);
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

    this.inputOperator.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.getAllOperators(value);
    });

    this.statuses = this.queuesService.getQueues().sort((a, b) => a.name.localeCompare(b.name));

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

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllCommands(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllCommands(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.commands != null ? this.commands.length : 0;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.commands.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: CommandsDTO) {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  csvFileSendToOperator(): void {
    const orderIds: string[] = this.selection.selected.map(order => order.orderId);
    if (orderIds) {
      const emailPreviewData: EmailPreviewDialogDetails = { mode: 'order', orderId: [], requestId: [] };
      emailPreviewData.orderId.push(...orderIds);
      this.dialog.open(MultiEmailPreviewDialogComponent, {
        width: '1000px',
        disableClose: true,
        data: emailPreviewData
      });
    }
  }

  countAdvanceFilter(cmdFilter: CommandsFilter): void {
    this.filterCount = 0;
    if (cmdFilter) {
      if (cmdFilter.orderId) {
        this.filterCount++;
      }
      if (cmdFilter.requestId) {
        this.filterCount++;
      }
      if (cmdFilter.operatorId) {
        this.filterCount++;
      }
      if (cmdFilter.status === 0 || cmdFilter.status) {
        this.filterCount++;
      }
      if (cmdFilter.rsmId) {
        this.filterCount++;
      }
      if (cmdFilter.requesterId) {
        this.filterCount++;
      }
      if (cmdFilter.sectorId) {
        this.filterCount++;
      }
      if (cmdFilter.zoneId) {
        this.filterCount++;
      }
      if (cmdFilter.companyId) {
        this.filterCount++;
      }
      if (cmdFilter.mainServiceCode) {
        this.filterCount++;
      }
      if (cmdFilter.backupServiceCode) {
        this.filterCount++;
      }
      if (cmdFilter.lastFullyAcceptedOrderID) {
        this.filterCount++;
      }
      if (cmdFilter.lastOrderId) {
        this.filterCount++;
      }
      if (cmdFilter.backbone && cmdFilter.backbone >= 0) {
        this.filterCount++;
      }
    }
  }

  resetAdvanceFilter(): void {
    this.advanceFilter = null;
    this.commands = [];
    this.selection.clear();
    this.orderFollowUpFilterForm.reset();
    this.getAllZones();
    this.getAllCompanies();
    this.countAdvanceFilter(null);
    this.getAllCommands(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  onLastOrderIdSelected(): void {
    if (this.orderFollowUpFilterForm.controls.lastOrderId.value) {
      this.orderFollowUpFilterForm.patchValue({
        lastFullyAcceptedOrderID: false
      });
    }
  }

  onLastFullyAcceptedOrderID(): void {
    if (this.orderFollowUpFilterForm.controls.lastFullyAcceptedOrderID.value) {
      this.orderFollowUpFilterForm.patchValue({
        lastOrderId: false
      });
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
    this.advanceFilter = Object.assign({}, this.orderFollowUpFilterForm.value);
    this.advanceFilter.zoneId =
      this.orderFollowUpFilterForm.controls.zoneId.value != null
        ? this.orderFollowUpFilterForm.controls.zoneId.value.id
        : '';
    this.advanceFilter.sectorId =
      this.orderFollowUpFilterForm.controls.sectorId.value != null
        ? this.orderFollowUpFilterForm.controls.sectorId.value.id
        : '';

    this.pageIndex = 0;
    this.searchValue = null;
    this.pageIndex = 0;
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllCommands(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  onSectorSelected(sector: Sector): void {
    if (sector) {
      this.orderFollowUpFilterForm.patchValue({
        zoneId: null,
        companyId: null
      });
    }
    this.getAllZones();
    this.getAllCompanies();
  }

  onZoneSelected(zone: Zone): void {
    if (zone) {
      this.orderFollowUpFilterForm.patchValue({
        sectorId: zone.sector,
        companyId: null
      });
    }
    this.getAllCompanies();
  }

  onCompanySelected(company: Company): void {
    if (company) {
      this.orderFollowUpFilterForm.patchValue({
        sectorId: company.zone.sector,
        zoneId: company.zone
      });
    }
  }

  emailPreview(data: CommandsDTO): void {
    this.emailPreviewData.mode = 'order';
    this.emailPreviewData.orderId.push(data.orderId);
    const dialogRef = this.dialog.open(EmailPreviewDialogComponent, {
      width: '700px',
      disableClose: true,
      data: this.emailPreviewData
    });
    dialogRef.afterClosed().subscribe(result => {
      this.emailPreviewData.orderId = [];
      if (result !== 'close') {
      }
    });
  }

  downloadCSV(data: CommandsDTO): void {
    if (data) {
      this.isLoading = true;
      this.sub$.add(
        this.commandService
          .download(data.orderId)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((csvContent: Blob) => {
            if (csvContent) {
              const blob = new Blob([csvContent], { type: 'application/octet-stream' });
              saveAs(blob, data.orderId + '.csv');
            }
          })
      );
    }
  }

  orderDetails(data: CommandsDTO): void {
    this.isLoading = true;
    const dialogRef = this.dialog.open(OrderMakeDialogComponent, {
      width: '1000px',
      data: { mode: 'edit', order: data },
      disableClose: true,
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isLoading = false;
      if (result !== 'close') {
        const orderResult: IOrderResultData = result;
        if (orderResult && orderResult.orderId) {
          if (orderResult.action === 'save' || orderResult.action === 'save_notify') {
            this.messageService.show(this.translateService.instant('common.save.success.message'));
          }

          if (orderResult.action === 'save_notify') {
            // show email preview
            this.orderNotify(orderResult.orderId);
          }
          this.getAllCommands(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
        }
      }
    });
  }

  orderNotify(orderId: string): void {
    const dialogRef = this.dialog.open(OrderNotifyDialogComponent, {
      width: '820px',
      disableClose: true,
      data: orderId
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'error') {
        this.messageService.show(this.translateService.instant('common.save.failed.mail'), 'error');
      } else if (result !== 'close') {
        this.messageService.show(this.translateService.instant('common.save.success.mail'));
      }
    });
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
    companyFilter.sector = this.orderFollowUpFilterForm.controls.sectorId.value;
    companyFilter.zone = this.orderFollowUpFilterForm.controls.zoneId.value;
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

  private getAllZones(searchValue?: string): void {
    this.isLoading = true;
    const zoneFilter: ZoneFilter = new ZoneFilter();
    zoneFilter.sector = this.orderFollowUpFilterForm.controls.sectorId.value;
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
      this.commandService
        .getAllCommandsRequesters()
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((contact: Contact[]) => {
          if (contact) {
            this.requesters = contact.sort((a, b) => a.fullName.localeCompare(b.fullName));
          }
        })
    );
  }

  private getAllCommands(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    advancefilter?: CommandsFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.commandService
        .getAllCommands(search, this.pageIndex, this.pageSize, sortField, sortDirection, advancefilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<CommandsDTO>) => {
          if (this.selection.selected.length > 0) {
            this.selection.clear();
          }

          if (page) {
            this.commands = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
