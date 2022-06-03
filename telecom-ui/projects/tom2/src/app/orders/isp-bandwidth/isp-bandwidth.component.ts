import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { saveAs } from 'file-saver';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
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
import { IspInformation, IspInformationFilter } from '../../shared/models/isp-information';
import { Operator } from '../../shared/models/operators';
import { Page } from '../../shared/models/page.model';
import { Queues } from '../../shared/models/queues';
import { CommandService } from '../../shared/service/commands/command.service';
import { IspBandwidthService } from '../../shared/service/isp-bandwidth/isp-bandwidth.service';
import { OperatorsService } from '../../shared/service/operators/operators.service';
import { QueuesService } from '../../shared/service/queues/queues.service';

@Component({
  selector: 'stgo-isp-bandwidth',
  templateUrl: './isp-bandwidth.component.html',
  styleUrls: ['./isp-bandwidth.component.scss']
})
export class IspBandwidthComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  searchValue: string;
  ispBandwidth: IspInformation[];
  ispBandwidthSelected: string[] = [];
  totalElements: number;
  statuses: Queues[];
  rsms: Observable<Contact[]>;
  requesters: Contact[];
  sectors: Observable<Sector[]>;
  zones: Zone[];
  companies: Company[];
  displayedColumns: string[] = ['select', 'orderId', 'bandwidth'];
  panelFilterOpenState = true;
  operators: Observable<Operator[]>;
  ispBandwidthAdvanceFilterForm = this.fb.group({
    requestId: [''],
    orderId: [''],
    operator: [null],
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
  advanceFilter: IspInformationFilter;
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<IspInformation>(this.allowMultiSelect, this.initialSelection);
  dataSource = new MatTableDataSource<IspInformation>();
  backbones: SiteBackbone[] = [
    { id: 1, name: 'Only' },
    { id: 0, name: 'Excluded' }
  ];

  inputOperators: Subject<string> = new Subject<string>();
  inputStatus: Subject<string> = new Subject<string>();
  inputSector: Subject<string> = new Subject<string>();
  inputZone: Subject<string> = new Subject<string>();
  inputCompany: Subject<string> = new Subject<string>();
  inputRsm: Subject<string> = new Subject<string>();
  inputRequester: Subject<string> = new Subject<string>();

  private filter: Subject<string> = new Subject();
  private sub$: Subscription = new Subscription();

  constructor(
    private operatorService: OperatorsService,
    private ispBandwidthService: IspBandwidthService,
    private commandService: CommandService,
    private queuesService: QueuesService,
    private sectorService: SectorService,
    private zoneService: ZoneService,
    private companyService: CompanyService,
    private contactService: ContactService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.ispBandwidthSelected = [];
    this.getAllIspBandwidth('id', 'asc');

    this.operators = this.inputOperators.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        return this.operatorService.getAllOperators(0, 50, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          }),
          finalize(() => (this.isLoading = false))
        );
      })
    );

    this.statuses = this.queuesService.getQueues().sort((a, b) => a.name.localeCompare(b.name));

    this.sectorService.url = '/sirene/sectors';
    this.sectors = this.inputSector.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.sectorService.getAllSectors(value, 0, 50, 'name', 'asc').pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          })
        );
      })
    );

    this.zoneService.url = '/sirene/zones';
    this.inputZone.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.getAllZones();
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

    this.sub$.add(
      this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchValue => {
        this.searchValue = searchValue;
        this.getAllIspBandwidth(this.sort.active, this.sort.direction, this.searchValue);
      })
    );
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllIspBandwidth(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllIspBandwidth(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  applyFilter(filterValue: string): void {
    if (filterValue && filterValue.length > 0) {
      this.searchValue = filterValue;
    } else {
      this.searchValue = null;
    }
    this.filter.next(this.searchValue);
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  applyAdvanceFilter(): void {
    this.pageIndex = 0;
    this.searchValue = null;
    this.advanceFilter = Object.assign({}, this.ispBandwidthAdvanceFilterForm.value);
    this.advanceFilter.zoneId =
      this.ispBandwidthAdvanceFilterForm.controls.zoneId.value != null
        ? this.ispBandwidthAdvanceFilterForm.controls.zoneId.value.id
        : '';
    this.advanceFilter.sectorId =
      this.ispBandwidthAdvanceFilterForm.controls.sectorId.value != null
        ? this.ispBandwidthAdvanceFilterForm.controls.sectorId.value.id
        : '';
    this.countAdvanceFilter();
    this.getAllIspBandwidth(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.ispBandwidthAdvanceFilterForm.reset();
    this.getAllCompanies();
    this.getAllZones();
    this.advanceFilter = null;
    this.countAdvanceFilter();
    this.dataSource.data = [];
    this.filterCount = 0;
    this.ispBandwidthSelected = [];
    this.getAllIspBandwidth('id', 'asc');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource != null ? this.dataSource.data.length : 0;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  exportDetails(): void {
    this.selection.selected.forEach(ispInfo => {
      this.ispBandwidthSelected.push(ispInfo.orderId);
    });
    if (this.ispBandwidthSelected.length > 0) {
      this.isLoading = true;
      this.sub$.add(
        this.ispBandwidthService
          .downloadIspInformation(this.ispBandwidthSelected)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((excelContent: Blob) => {
            if (excelContent) {
              const blob = new Blob([excelContent], { type: 'application/octet-stream' });
              saveAs(blob, 'IspInformation.xlsx');
            }
          })
      );
    }
  }

  onSectorSelected(sector: Sector): void {
    if (sector) {
      this.ispBandwidthAdvanceFilterForm.patchValue({
        zoneId: null,
        companyId: null
      });
    }
    this.getAllZones();
    this.getAllCompanies();
  }

  onZoneSelected(zone: Zone): void {
    if (zone) {
      this.ispBandwidthAdvanceFilterForm.patchValue({
        sectorId: zone.sector,
        companyId: null
      });
    }
    this.getAllCompanies();
  }

  onCompanySelected(company: Company): void {
    if (company) {
      this.ispBandwidthAdvanceFilterForm.patchValue({
        sectorId: company.zone.sector,
        zoneId: company.zone
      });
    }
  }

  onLastOrderIdSelected(): void {
    if (this.ispBandwidthAdvanceFilterForm.controls.lastOrderId.value) {
      this.ispBandwidthAdvanceFilterForm.patchValue({
        lastFullyAcceptedOrderID: false
      });
    }
  }

  onLastFullyAcceptedOrderID(): void {
    if (this.ispBandwidthAdvanceFilterForm.controls.lastFullyAcceptedOrderID.value) {
      this.ispBandwidthAdvanceFilterForm.patchValue({
        lastOrderId: false
      });
    }
  }

  private countAdvanceFilter(): void {
    this.filterCount = 0;
    if (this.advanceFilter) {
      if (this.advanceFilter.id) {
        this.filterCount++;
      }
      if (this.advanceFilter.orderId) {
        this.filterCount++;
      }
      if (this.advanceFilter.requestId) {
        this.filterCount++;
      }
      if (this.advanceFilter.backUpServiceCode) {
        this.filterCount++;
      }
      if (this.advanceFilter.mainServiceCode) {
        this.filterCount++;
      }
      if (this.advanceFilter.operator) {
        this.filterCount++;
      }
      if (this.advanceFilter.status === 0 || this.advanceFilter.status) {
        this.filterCount++;
      }
      if (this.advanceFilter.rsmId) {
        this.filterCount++;
      }
      if (this.advanceFilter.requesterId) {
        this.filterCount++;
      }
      if (this.advanceFilter.sectorId) {
        this.filterCount++;
      }
      if (this.advanceFilter.zoneId) {
        this.filterCount++;
      }
      if (this.advanceFilter.companyId) {
        this.filterCount++;
      }
      if (this.advanceFilter.lastFullyAcceptedOrderID) {
        this.filterCount++;
      }
      if (this.advanceFilter.lastOrderId) {
        this.filterCount++;
      }
      if (this.advanceFilter.backbone && this.advanceFilter.backbone >= 0) {
        this.filterCount++;
      }
    }
  }

  private getAllZones(searchValue?: string): void {
    this.isLoading = true;
    const zoneFilter: ZoneFilter = new ZoneFilter();
    zoneFilter.sector = this.ispBandwidthAdvanceFilterForm.controls.sectorId.value;
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

  private getAllCompanies(searchValue?: string): void {
    this.isLoading = true;
    const companyFilter: CompanyFilter = new CompanyFilter();
    companyFilter.sector = this.ispBandwidthAdvanceFilterForm.controls.sectorId.value;
    companyFilter.zone = this.ispBandwidthAdvanceFilterForm.controls.zoneId.value;
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

  private getAllIspBandwidth(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    advancefilter?: IspInformationFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.ispBandwidthService
        .getAllIspBandwidths(search, this.pageIndex, this.pageSize, sortField, sortDirection, advancefilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<IspInformation>) => {
          if (this.selection.selected.length > 0) {
            this.selection.clear();
          }
          if (page) {
            this.ispBandwidth = page.content;
            this.dataSource.data = this.ispBandwidth;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
