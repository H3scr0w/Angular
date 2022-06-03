import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { RequestType } from '../../enums/enum';
import { KeyValue } from '../../models/key-value';
import { Operator } from '../../models/operators';
import { Page } from '../../models/page.model';
import { TelecomService, TelecomServiceFilter } from '../../models/telecom-service-selector';
import { OperatorsService } from '../../service/operators/operators.service';
import { TelecomServiceSelectorService } from '../../service/telecom-service-selector/telecom-service-selector.service';

@Component({
  selector: 'stgo-telecom-service-selector',
  templateUrl: './telecom-service-selector.component.html',
  styleUrls: ['./telecom-service-selector.component.css']
})
export class TelecomServiceSelectorComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  showDOMTOM = false;
  pageIndex = 0;
  pageSize = 10;
  totalElements: number;
  operators: Observable<Operator[]>;
  serviceLevels: KeyValue[];
  serviceTypes: KeyValue[];
  mainOrBackupServices: KeyValue[];
  backupSpecificities: KeyValue[];
  backupServices: KeyValue[];
  telecomServiceFilter: TelecomServiceFilter;
  telecomServices: TelecomService[];
  inputOperator: Subject<string> = new Subject<string>();
  displayedColumns: string[] = [
    'id',
    'operator',
    'serviceCatalog',
    'countryCode',
    'serviceTitle',
    'mainServiceCode',
    'backupServiceCode',
    'optionsAvailables',
    'setupCost',
    'monthlyCost',
    'currency',
    'actions'
  ];

  @Input()
  countryCode: string;

  @Input()
  operatorId: number;

  @Input()
  readOnlyOperator: boolean;

  @Input()
  readOnlyCountry: boolean;

  @Output()
  selectedService = new EventEmitter<TelecomService>();

  @Input()
  requestType: string;

  telecomServiceSelectorForm = this.fb.group({
    countryCode: ['', Validators.required],
    isDOMTOM: [''],
    operator: [''],
    serviceLevel: [''],
    serviceType: [''],
    bandwidthMainServiceFrom: [''],
    bandwidthMainServiceTo: [''],
    mainServiceCosType: [''],
    mainTechno: [''],
    backupSpecificity: [''],
    bandwidthBackupServiceFrom: [''],
    bandwidthBackupServiceTo: [''],
    backupServiceCosType: [''],
    backupTechno: [''],
    monthlyCostLte: ['']
  });
  isMainAccess = true;
  isBackUpAccess = true;

  private sub$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private operatorService: OperatorsService,
    private telecomServiceSelectorService: TelecomServiceSelectorService
  ) {}

  ngOnInit() {
    this.operators = this.inputOperator.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.operatorService.getAllOperators(0, 200, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.serviceLevels = this.telecomServiceSelectorService.getServiceLevels();
    this.serviceTypes = this.telecomServiceSelectorService.getServiceTypes();
    this.mainOrBackupServices = this.telecomServiceSelectorService.getMainOrBackupServices();
    this.backupSpecificities = this.telecomServiceSelectorService.getBackupSpecificities();

    this.telecomServiceSelectorForm.patchValue({
      operator: this.operatorId,
      serviceLevel: null,
      serviceType: null,
      mainServiceCosType: null,
      backupSpecificity: 'No',
      backupServiceCosType: null,
      countryCode: this.readOnlyCountry ? this.countryCode : ''
    });

    if (this.requestType && this.requestType.toString() === RequestType.Device.toString()) {
      this.isMainAccess = false;
      this.isBackUpAccess = false;
    }

    this.telecomServiceSelectorForm.get('countryCode').valueChanges.subscribe(val => {
      const countryCode: string = val;
      this.telecomServiceSelectorForm.get('countryCode').setValue(countryCode.toUpperCase(), { emitEvent: false });
      this.telecomServiceSelectorForm.patchValue({
        isDOMTOM: false
      });
      this.showDOMTOM = countryCode.toUpperCase() === 'FR';
    });
  }

  ngOnChanges() {
    this.telecomServiceSelectorForm.patchValue({
      countryCode: this.countryCode ? this.countryCode : '',
      operator: this.operatorId ? this.operatorId : null
    });
    if (this.requestType && this.requestType.toString() === RequestType.Device.toString()) {
      this.isMainAccess = false;
      this.isBackUpAccess = false;
    } else {
      this.isMainAccess = true;
      this.isBackUpAccess = true;
    }
    this.telecomServices = [];
    this.showDOMTOM = this.countryCode === 'FR';
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getTelecomServices(this.sort.active, this.sort.direction, this.telecomServiceFilter);
      });
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getTelecomServices(this.sort.active, this.sort.direction, this.telecomServiceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onServiceSelected(service: TelecomService): void {
    if (!service) {
      return;
    }
    this.selectedService.emit(service);
  }

  applyFilter(): void {
    this.telecomServiceFilter = Object.assign(this.telecomServiceSelectorForm.value);
    this.pageIndex = 0;
    if (this.requestType && this.requestType.toString() === RequestType.Device.toString()) {
      this.telecomServiceFilter.requestType = RequestType[RequestType.Device];
    }
    this.getTelecomServices(this.sort.active, this.sort.direction, this.telecomServiceFilter);
  }

  resetFilter(): void {
    this.telecomServiceSelectorForm.patchValue({
      countryCode: this.countryCode ? this.countryCode : '',
      operator: this.operatorId ? this.operatorId : null,
      isDOMTOM: false,
      serviceLevel: null,
      serviceType: null,
      bandwidthMainServiceFrom: null,
      bandwidthMainServiceTo: null,
      mainServiceCosType: null,
      mainTechno: null,
      backupSpecificity: null,
      bandwidthBackupServiceFrom: null,
      bandwidthBackupServiceTo: null,
      backupServiceCosType: null,
      backupTechno: null,
      monthlyCostLte: null
    });
    this.pageIndex = 0;
    this.totalElements = 0;
    this.telecomServiceFilter = null;
    this.telecomServices = [];
    this.showDOMTOM = false;
  }

  getSetupCost(service: TelecomService): number {
    if (!service) {
      return 0;
    }
    let setupCost = 0;

    if (service.setupCostsCpe1) {
      setupCost += service.setupCostsCpe1;
    }
    if (service.setupCostsCpe2) {
      setupCost += service.setupCostsCpe2;
    }
    if (service.setupCostsIpPort1) {
      setupCost += service.setupCostsIpPort1;
    }
    if (service.setupCostsIpPort2) {
      setupCost += service.setupCostsIpPort2;
    }
    if (service.setupCostsLl1) {
      setupCost += service.setupCostsLl1;
    }
    if (service.setupCostsLl2) {
      setupCost += service.setupCostsLl2;
    }

    return setupCost;
  }

  getMonthlyCost(service: TelecomService): number {
    if (!service) {
      return 0;
    }
    let monthlyCost = 0;

    if (service.monthlyCostsCpe1) {
      monthlyCost += service.monthlyCostsCpe1;
    }
    if (service.monthlyCostsCpe2) {
      monthlyCost += service.monthlyCostsCpe2;
    }
    if (service.monthlyCostsIpPort1) {
      monthlyCost += service.monthlyCostsIpPort1;
    }
    if (service.monthlyCostsIpPort2) {
      monthlyCost += service.monthlyCostsIpPort2;
    }
    if (service.monthlyCostsLl1) {
      monthlyCost += service.monthlyCostsLl1;
    }
    if (service.monthlyCostsLl2) {
      monthlyCost += service.monthlyCostsLl2;
    }
    return monthlyCost;
  }

  private getTelecomServices(
    sortField?: string,
    sortDirection?: SortDirection,
    telecomServiceSelectorFilter?: TelecomServiceFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.telecomServiceSelectorService
        .getTelecomServices(this.pageIndex, this.pageSize, sortField, sortDirection, null, telecomServiceSelectorFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<TelecomService>) => {
          this.telecomServices = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        })
    );
  }
}
