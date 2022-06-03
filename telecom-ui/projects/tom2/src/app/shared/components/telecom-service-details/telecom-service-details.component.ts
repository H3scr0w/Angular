import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Catalog } from '../../models/catalog';
import { CatalogOptions } from '../../models/catalog-options';
import { OrderItem } from '../../models/commands';
import { Contract, ContractDTO } from '../../models/contracts';
import { Operator } from '../../models/operators';
import { Page } from '../../models/page.model';
import { RequestItem } from '../../models/request';
import { TelecomServiceDetail } from '../../models/telecom-service-detail';
import { CatalogService } from '../../service/catalog/catalog.service';
import { CommandService } from '../../service/commands/command.service';
import { ContractService } from '../../service/contract/contract.service';
import { EventEmitterService } from '../../service/event-emitter/event-emitter.service';
import { OperatorsService } from '../../service/operators/operators.service';
import { RequestService } from '../../service/request/request.service';
import { CatalogOptionsAddComponent } from '../catalog-option-add/catalog-option-add.component';

@Component({
  selector: 'stgo-telecom-service-details',
  templateUrl: './telecom-service-details.component.html',
  styleUrls: ['./telecom-service-details.component.css']
})
export class TelecomServiceDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  telecomServiceDetailCurrent: TelecomServiceDetail;
  @Input()
  isReadOnly = true;
  @Input()
  catalogId: number;
  @Input()
  orderId: string;
  @Input()
  requestId: number;
  @Input()
  isOperatorReadOnly: boolean;
  @Output()
  telecomServiceDetailChanged = new EventEmitter<TelecomServiceDetail>();

  isLoading = false;
  operators: Observable<Operator[]>;
  contracts: ContractDTO[];
  catalogs: Catalog[];
  catalogOptions: CatalogOptions[];
  orderItems: OrderItem[];
  requestItems: RequestItem[];
  catalogOptionsLoaded: Subject<CatalogOptions[]> = new Subject();
  inputOperator: Subject<string> = new Subject<string>();
  private sub$: Subscription = new Subscription();

  telecomServiceDetailForm = this.formBuilder.group({
    operator: ['', Validators.required],
    contract: ['', Validators.required],
    catalog: ['', Validators.required],
    serviceTitle: [''],
    mainServiceCode: [''],
    backupServiceCode: [''],
    options: [null],
    routerCode1: [''],
    routerCode2: ['']
  });

  constructor(
    private formBuilder: FormBuilder,
    private operatorService: OperatorsService,
    private contractService: ContractService,
    private catalogService: CatalogService,
    private eventEmitterService: EventEmitterService,
    private commandService: CommandService,
    private requestService: RequestService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.operators = this.inputOperator.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.operatorService.getAllOperators(0, 200, 'name', 'asc', value).pipe(
          switchMap(result => {
            if (result) {
              return of(result.content);
            }
          })
        );
      })
    );

    this.sub$.add(
      this.telecomServiceDetailForm.valueChanges.subscribe(val => {
        const telecomServiceDetail: TelecomServiceDetail = Object.assign(this.telecomServiceDetailForm.value);
        telecomServiceDetail.id = this.telecomServiceDetailCurrent.id;
        telecomServiceDetail.catalogVersion = this.telecomServiceDetailCurrent.catalogVersion;
        telecomServiceDetail.optionsCSV = this.telecomServiceDetailCurrent.optionsCSV;

        this.telecomServiceDetailChanged.emit(telecomServiceDetail);
      })
    );

    if (this.eventEmitterService && this.eventEmitterService.invokeFormValidateFunction) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeFormValidateFunction.subscribe(() => {
        this.eventEmitterService.validStatus.push(this.validateForm());
      });
    }

    this.sub$.add(
      this.catalogOptionsLoaded.subscribe(data => {
        if (data) {
          this.setCatalogOptionsByOptionsCSV(this.telecomServiceDetailCurrent.optionsCSV, data);
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const property in changes) {
      if (property === 'catalogId' && changes[property].currentValue !== changes[property].previousValue) {
        this.getCatalog(changes[property].currentValue);
      } else if (property === 'telecomServiceDetailCurrent') {
        this.telecomServiceDetailCurrent = changes[property].currentValue;
        this.getContracts(this.telecomServiceDetailCurrent.operator);
        this.getCatalogOptions(this.telecomServiceDetailCurrent.catalogVersion);

        this.telecomServiceDetailForm.patchValue({
          operator: this.telecomServiceDetailCurrent.operator,
          contract: this.telecomServiceDetailCurrent.contract,
          catalog: this.telecomServiceDetailCurrent.catalog,
          serviceTitle: this.telecomServiceDetailCurrent.serviceTitle,
          mainServiceCode: this.telecomServiceDetailCurrent.mainServiceCode,
          backupServiceCode: this.telecomServiceDetailCurrent.backupServiceCode,
          routerCode1: this.telecomServiceDetailCurrent.routerCode1,
          routerCode2: this.telecomServiceDetailCurrent.routerCode2
        });
      }
    }
  }

  onOperatorSelected(operator: Operator): void {
    this.telecomServiceDetailForm.patchValue({
      contract: null,
      catalog: null,
      operator
    });
    if (!operator) {
      this.contracts = null;
      this.catalogs = null;
      return;
    } else {
      this.telecomServiceDetailForm.patchValue({
        operator
      });
      this.telecomServiceDetailCurrent.operator = operator;
    }
    this.getContracts(operator);
  }

  onContractSelected(contract: Contract): void {
    this.telecomServiceDetailForm.patchValue({
      contract,
      catalog: null
    });
    if (this.telecomServiceDetailCurrent.operator) {
      contract.operator = this.telecomServiceDetailCurrent.operator.id;
    }
    this.telecomServiceDetailCurrent.contract = contract;
    this.getCatalogs(contract);
  }

  hasError(controlName: string, errorName: string): boolean {
    return (
      this.telecomServiceDetailForm.controls[controlName].hasError(errorName) &&
      this.telecomServiceDetailForm.controls[controlName].touched
    );
  }

  public addOptions(): void {
    const dialogRef = this.dialog.open(CatalogOptionsAddComponent, {
      width: '350px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: CatalogOptions) => {
      if (result !== null) {
        let tempCatalogOptions: CatalogOptions[] = [];
        if (this.catalogOptions == null) {
          tempCatalogOptions.push(result);
        } else {
          tempCatalogOptions = this.catalogOptions.filter(option => option && option.optionCode !== result.optionCode);
          tempCatalogOptions.push(result);
        }
        this.catalogOptions = tempCatalogOptions;
        if (this.telecomServiceDetailForm.value.options?.length > 0) {
          this.telecomServiceDetailCurrent.optionsCSV =
            this.telecomServiceDetailForm.value.options.map(option => option.optionCode).join() +
            ',' +
            result.optionCode;
        } else {
          this.telecomServiceDetailCurrent.optionsCSV = result.optionCode;
        }
        this.catalogOptionsLoaded.next(this.catalogOptions);
      }
    });
  }

  private getContracts(operator: Operator): void {
    const contractFilter: ContractDTO = new ContractDTO();
    contractFilter.operator = operator;
    this.isLoading = true;
    this.sub$.add(
      this.contractService
        .getAllContract(0, 200, 'code', 'asc', '', contractFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<ContractDTO>) => {
          if (page) {
            this.contracts = page.content;
          }
        })
    );
  }

  private getCatalogs(contract: Contract): void {
    const catalogFilter: Catalog = new Catalog();
    catalogFilter.contract = contract;
    this.isLoading = true;
    this.sub$.add(
      this.catalogService
        .getAllCatalogs(0, 200, 'name', 'asc', '', catalogFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Catalog>) => {
          if (page) {
            this.catalogs = page.content;
          }
        })
    );
  }

  private getCatalogOptions(catalogVersion: string): void {
    const sources = [];
    if (this.orderId) {
      sources.push(this.commandService.getAllOrderItems(this.orderId));
    } else if (this.requestId) {
      sources.push(this.requestService.getAllRequestItems(this.requestId));
    }

    if (sources.length > 0) {
      if (catalogVersion) {
        sources.push(this.catalogService.getCatalogOptions(0, 200, 'optionName', 'asc', '', catalogVersion));
      }
      forkJoin(sources).subscribe(results => {
        if (this.orderId && results[0]) {
          this.orderItems = results[0] as OrderItem[];
        } else if (this.requestId && results[0]) {
          this.requestItems = results[0] as RequestItem[];
        }

        if (catalogVersion && results[1]) {
          const catalogItems = results[1] as Page<CatalogOptions>;
          if (catalogItems) {
            this.catalogOptions = catalogItems.content;
          }
        }

        if (this.orderItems) {
          this.orderItems.forEach(item => {
            if (!this.catalogOptions) {
              this.setCustomOrderOptions(item);
            } else {
              if (!this.catalogOptions.some(option => option.optionCode === item.name)) {
                this.setCustomOrderOptions(item);
              } else {
                // remap Catalog Items value
                this.catalogOptions.find(code => code.optionCode === item.name).setupCost = Number(
                  this.orderItems.find(itm => itm.name === item.name && itm.type === 'SCI').value
                );

                this.catalogOptions.find(code => code.optionCode === item.name).monthlyCost = Number(
                  this.orderItems.find(itm => itm.name === item.name && itm.type === 'MCI').value
                );
              }
            }
          });
        } else if (this.requestItems) {
          this.requestItems.forEach(item => {
            if (!this.catalogOptions) {
              this.setCustomRequestOptions(item);
            } else {
              if (!this.catalogOptions.some(option => option.optionCode === item.name)) {
                this.setCustomRequestOptions(item);
              } else {
                // remap Catalog Items value
                this.catalogOptions.find(code => code.optionCode === item.name).setupCost = Number(
                  this.requestItems.find(itm => itm.name === item.name && itm.type === 'SCI').value
                );

                this.catalogOptions.find(code => code.optionCode === item.name).monthlyCost = Number(
                  this.requestItems.find(itm => itm.name === item.name && itm.type === 'MCI').value
                );
              }
            }
          });
        }
        this.catalogOptionsLoaded.next(this.catalogOptions);
      });
    } else if (catalogVersion) {
      this.sub$.add(
        this.catalogService
          .getCatalogOptions(0, 200, 'optionName', 'asc', '', catalogVersion)
          .subscribe((page: Page<CatalogOptions>) => {
            if (page) {
              this.catalogOptions = page.content;
              this.catalogOptionsLoaded.next(this.catalogOptions);
            }
          })
      );
    }
  }

  private setCustomOrderOptions(orderItem: OrderItem): void {
    const newCatalogOption = new CatalogOptions();
    newCatalogOption.optionCode = orderItem.name;
    newCatalogOption.commonCode = orderItem.name;
    newCatalogOption.optionName = orderItem.name;

    const mciOrderItem: OrderItem = this.orderItems.find(item => item.name === orderItem.name && item.type === 'MCI');
    if (mciOrderItem && mciOrderItem.value) {
      newCatalogOption.monthlyCost = Number(mciOrderItem.value);
    }

    const sciOrderItem: OrderItem = this.orderItems.find(item => item.name === orderItem.name && item.type === 'SCI');
    if (sciOrderItem && sciOrderItem.value) {
      newCatalogOption.setupCost = Number(sciOrderItem.value);
    }

    if (this.catalogOptions == null) {
      this.catalogOptions = [];
    }
    this.catalogOptions.push(newCatalogOption);
  }

  private setCustomRequestOptions(requestItem: RequestItem): void {
    const newCatalogOption = new CatalogOptions();
    newCatalogOption.optionCode = requestItem.name;
    newCatalogOption.commonCode = requestItem.name;
    newCatalogOption.optionName = requestItem.name;

    const mciRequestItem: RequestItem = this.requestItems.find(
      item => item.name === requestItem.name && item.type === 'MCI'
    );
    if (mciRequestItem && mciRequestItem.value) {
      newCatalogOption.monthlyCost = Number(mciRequestItem.value);
    }

    const sciRequestItem: RequestItem = this.requestItems.find(
      item => item.name === requestItem.name && item.type === 'SCI'
    );
    if (sciRequestItem && sciRequestItem.value) {
      newCatalogOption.setupCost = Number(sciRequestItem.value);
    }

    if (this.catalogOptions == null) {
      this.catalogOptions = [];
    }
    this.catalogOptions.push(newCatalogOption);
  }

  private setCatalogOptionsByOptionsCSV(optionsCSV: string, catalogOptionsLookup: CatalogOptions[]): void {
    if (!optionsCSV || !catalogOptionsLookup) {
      this.telecomServiceDetailForm.patchValue({
        options: null
      });
      return;
    }
    const optionsList = optionsCSV.split(',');
    this.telecomServiceDetailForm.patchValue({
      options: catalogOptionsLookup.filter(e => optionsList.includes(e.optionCode))
    });
  }

  private validateForm(): boolean {
    if (this.telecomServiceDetailForm.invalid) {
      Object.keys(this.telecomServiceDetailForm.controls).forEach(key => {
        this.telecomServiceDetailForm.controls[key].markAllAsTouched();
      });
      return false;
    }
    return true;
  }

  private getCatalog(id: number) {
    this.isLoading = true;
    this.sub$.add(
      this.catalogService
        .getCatalog(id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((catalog: Catalog) => {
          if (catalog) {
            this.telecomServiceDetailForm.patchValue({
              contract: catalog.contract,
              catalog
            });

            this.getCatalogs(catalog.contract);
          }
        })
    );
  }
}
