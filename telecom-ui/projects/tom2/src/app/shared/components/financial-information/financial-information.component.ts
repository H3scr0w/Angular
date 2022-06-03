import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import forEach from 'lodash/forEach';
import { Subject, Subscription } from 'rxjs';
import { CatalogDiscount } from '../../../../../../tempo/src/app/shared/models/catalog-discount';
import { CatalogDiscountService } from '../../../../../../tempo/src/app/shared/service/catalog-discount/catalog-discount.service';
import { DynamicControlBase } from '../../classes/dynamic-control-base';
import { DynamicControlOptions } from '../../classes/dynamic-control-options';
import { STGONumberDynamic } from '../../classes/dynamic-stgoNumber';
import { DynamicControlType } from '../../enums/enum';
import { CatalogOptions } from '../../models/catalog-options';
import { FinancialInformation } from '../../models/financial-information';
import { EventEmitterService } from '../../service/event-emitter/event-emitter.service';

@Component({
  selector: 'stgo-financial-information',
  templateUrl: './financial-information.component.html',
  styleUrls: ['./financial-information.component.css']
})
export class FinancialInformationComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  finInfoCurrent: FinancialInformation;
  @Input()
  isReadOnly = true;
  @Input()
  finInfoCatalogOptions: CatalogOptions[];
  @Input()
  catalogId: number;
  @Output()
  finInfoChanged = new EventEmitter<FinancialInformation>();
  @Output()
  setupCatalogOptionsChanged = new EventEmitter<any>();
  @Output()
  monthlyCatalogOptionsChanged = new EventEmitter<any>();

  setupCatalogOptions: any;
  setupCatalogOptionsTotal = 0;
  setupFixedTotal = 0;
  setupTotal$: Subject<number> = new Subject();

  monthlyCatalogOptions: any;
  monthlyCatalogOptionsTotal = 0;
  monthlyFixedTotal = 0;
  monthlyTotal$: Subject<number> = new Subject();

  discount: CatalogDiscount;

  catalogOptionsSetupControls: DynamicControlBase<any>[];
  catalogOptionsMonthlyControls: DynamicControlBase<any>[];

  financialInfoForm = this.formBuilder.group({
    setupMainLlCost: [''],
    setupMainIpPortCost: [''],
    setupMainCpeCost: [''],
    setupBackupLlCost: [''],
    setupBackupIpPortCost: [''],
    setupBackupCpeCost: [''],
    setupTotalCost: [''],
    setupOtherDiscount: [''],
    setupTotalCostTaxes: [''],
    setupTotalCostAfterDiscount: [''],
    setupComments: [''],
    monthlyMainLlCost: [''],
    monthlyMainIpPortCost: [''],
    monthlyMainCpeCost: [''],
    monthlyBackupLlCost: [''],
    monthlyBackupIpPortCost: [''],
    monthlyBackupCpeCost: [''],
    monthlyTotalCost: [''],
    monthlyOtherDiscount: [''],
    monthlyTotalCostTaxes: [''],
    monthlyTotalCostAfterDiscount: [''],
    monthlyComments: [''],
    currency: ['']
  });
  private sub$: Subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private catalogDiscountService: CatalogDiscountService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.financialInfoForm.valueChanges.subscribe(val => {
      const financialInfo: FinancialInformation = Object.assign(this.financialInfoForm.value);
      this.finInfoChanged.emit(financialInfo);
    });

    if (this.eventEmitterService && this.eventEmitterService.invokeFormValidateFunction) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeFormValidateFunction.subscribe(() => {
        this.eventEmitterService.validStatus.push(this.validateForm());
      });
    }

    this.setupTotal$.subscribe(val => {
      this.financialInfoForm.patchValue({
        setupTotalCost: this.setupCatalogOptionsTotal + this.setupFixedTotal
      });
      this.applySetupCatalogDiscount();
    });

    this.monthlyTotal$.subscribe(val => {
      this.financialInfoForm.patchValue({
        monthlyTotalCost: this.monthlyCatalogOptionsTotal + this.monthlyFixedTotal
      });
      this.applyMonthlyCatalogDiscount();
    });

    this.financialInfoForm.get('currency').valueChanges.subscribe(val => {
      if (!val) {
        return;
      }
      const currency: string = val;
      this.financialInfoForm.get('currency').setValue(currency.toUpperCase(), { emitEvent: false });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'finInfoCatalogOptions') {
        this.remapSetupCost();
        this.remapMonthlyCost();
        this.setCatalogOptionsSetupDynamicControls(this.finInfoCatalogOptions);
        this.setCatalogOptionsMonthlyDynamicControls(this.finInfoCatalogOptions);
        this.setCatalogOptionSetupTotalCost();
        this.setCatalogOptionMonthlyTotalCost();
      } else if (propName === 'catalogId') {
        this.getCatalogDiscount(this.catalogId);
      } else if (propName === 'isReadOnly' && this.isReadOnly) {
        this.setupCatalogOptions = null;
        this.monthlyCatalogOptions = null;
        this.setCatalogOptionsSetupDynamicControls(this.finInfoCatalogOptions);
        this.setCatalogOptionsMonthlyDynamicControls(this.finInfoCatalogOptions);
        this.setCatalogOptionSetupTotalCost();
        this.setCatalogOptionMonthlyTotalCost();
      }
    }

    if (this.finInfoCurrent) {
      this.setSetupTotalCost(this.finInfoCurrent);
      this.setMonthlyTotalCost(this.finInfoCurrent);
      this.applySetupCatalogDiscount();
      this.applyMonthlyCatalogDiscount();
      this.financialInfoForm.patchValue({
        setupMainLlCost: this.finInfoCurrent.setupMainLlCost,
        setupMainIpPortCost: this.finInfoCurrent.setupMainIpPortCost,
        setupMainCpeCost: this.finInfoCurrent.setupMainCpeCost,
        setupBackupLlCost: this.finInfoCurrent.setupBackupLlCost,
        setupBackupIpPortCost: this.finInfoCurrent.setupBackupIpPortCost,
        setupBackupCpeCost: this.finInfoCurrent.setupBackupCpeCost,
        setupTotalCost: this.setupCatalogOptionsTotal + this.setupFixedTotal,
        setupOtherDiscount: this.finInfoCurrent.setupOtherDiscount,
        setupTotalCostTaxes: this.finInfoCurrent.setupTotalCostTaxes,
        // setupTotalCostAfterDiscount: this.finInfoCurrent.setupTotalCostAfterDiscount,
        setupComments: this.finInfoCurrent.setupComments,
        monthlyMainLlCost: this.finInfoCurrent.monthlyMainLlCost,
        monthlyMainIpPortCost: this.finInfoCurrent.monthlyMainIpPortCost,
        monthlyMainCpeCost: this.finInfoCurrent.monthlyMainCpeCost,
        monthlyBackupLlCost: this.finInfoCurrent.monthlyBackupLlCost,
        monthlyBackupIpPortCost: this.finInfoCurrent.monthlyBackupIpPortCost,
        monthlyBackupCpeCost: this.finInfoCurrent.monthlyBackupCpeCost,
        monthlyTotalCost: this.monthlyCatalogOptionsTotal + this.monthlyFixedTotal,
        monthlyOtherDiscount: this.finInfoCurrent.monthlyOtherDiscount,
        monthlyTotalCostTaxes: this.finInfoCurrent.monthlyTotalCostTaxes,
        // monthlyTotalCostAfterDiscount: this.finInfoCurrent.monthlyTotalCostAfterDiscount,
        monthlyComments: this.finInfoCurrent.monthlyComments,
        currency: this.finInfoCurrent.currency
      });
    }
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    if (errorName === 'pattern' && !this.financialInfoForm.controls[controlName].hasError('required')) {
      return this.financialInfoForm.controls[controlName].hasError(errorName);
    }
    return this.financialInfoForm.controls[controlName].hasError(errorName);
  }

  catalogOptionSetupCostChanged(dynamicValue: any): void {
    this.setupCatalogOptions = dynamicValue;
    this.setupCatalogOptionsChanged.emit(dynamicValue);
    this.setCatalogOptionSetupTotalCost();
  }

  catalogOptionMonthlyCostChanged(dynamicValue: any): void {
    this.monthlyCatalogOptions = dynamicValue;
    this.monthlyCatalogOptionsChanged.emit(dynamicValue);
    this.setCatalogOptionMonthlyTotalCost();
  }

  private remapSetupCost(): void {
    if (this.setupCatalogOptions && this.finInfoCatalogOptions) {
      const catalogOptions: any = this.setupCatalogOptions;
      this.finInfoCatalogOptions.forEach(element => {
        if (catalogOptions.hasOwnProperty(element.optionCode)) {
          this.finInfoCatalogOptions.find(code => code.optionCode === element.optionCode).setupCost =
            catalogOptions[element.optionCode];
        }
      });
    }
    this.setupCatalogOptions = null;
  }

  private remapMonthlyCost(): void {
    if (this.monthlyCatalogOptions && this.finInfoCatalogOptions) {
      const catalogOptions: any = this.monthlyCatalogOptions;
      this.finInfoCatalogOptions.forEach(element => {
        if (catalogOptions.hasOwnProperty(element.optionCode)) {
          this.finInfoCatalogOptions.find(code => code.optionCode === element.optionCode).monthlyCost =
            catalogOptions[element.optionCode];
        }
      });
    }
    this.monthlyCatalogOptions = null;
  }

  private setSetupTotalCost(finInfo: FinancialInformation): void {
    this.setupFixedTotal = 0;
    if (finInfo) {
      if (finInfo.setupMainLlCost) {
        this.setupFixedTotal += Number(finInfo.setupMainLlCost);
      }
      if (finInfo.setupMainIpPortCost) {
        this.setupFixedTotal += Number(finInfo.setupMainIpPortCost);
      }
      if (finInfo.setupMainCpeCost) {
        this.setupFixedTotal += Number(finInfo.setupMainCpeCost);
      }
      if (finInfo.setupBackupLlCost) {
        this.setupFixedTotal += Number(finInfo.setupBackupLlCost);
      }
      if (finInfo.setupBackupIpPortCost) {
        this.setupFixedTotal += Number(finInfo.setupBackupIpPortCost);
      }
      if (finInfo.setupBackupCpeCost) {
        this.setupFixedTotal += Number(finInfo.setupBackupCpeCost);
      }
    }

    this.setupTotal$.next(this.setupFixedTotal);
  }

  private setCatalogOptionSetupTotalCost(): void {
    let total = 0;
    if (this.setupCatalogOptions) {
      forEach(this.setupCatalogOptions, (value, key) => {
        total += Number(value);
      });
    } else if (this.finInfoCatalogOptions) {
      this.finInfoCatalogOptions.forEach(element => {
        total += Number(element.setupCost);
      });
    }
    this.setupCatalogOptionsTotal = total;
    this.setupTotal$.next(this.setupCatalogOptionsTotal);
  }

  private setCatalogOptionsSetupDynamicControls(catalogOptions: CatalogOptions[]) {
    if (!catalogOptions || catalogOptions.length === 0) {
      return;
    }
    let stgoNumber: STGONumberDynamic;
    let dynamicControlOptions: DynamicControlOptions<string>;
    this.catalogOptionsSetupControls = [];
    catalogOptions.forEach(element => {
      dynamicControlOptions = new DynamicControlOptions(
        DynamicControlType.stgoNumber,
        element.setupCost ? element.setupCost.toString() : '0',
        element.optionCode,
        element.optionName,
        false,
        0,
        '',
        '18',
        '2'
      );
      stgoNumber = new STGONumberDynamic(dynamicControlOptions);
      this.catalogOptionsSetupControls.push(stgoNumber);
    });
  }

  private setMonthlyTotalCost(finInfo: FinancialInformation): void {
    this.monthlyFixedTotal = 0;
    if (finInfo) {
      if (finInfo.monthlyMainLlCost) {
        this.monthlyFixedTotal += Number(finInfo.monthlyMainLlCost);
      }
      if (finInfo.monthlyMainIpPortCost) {
        this.monthlyFixedTotal += Number(finInfo.monthlyMainIpPortCost);
      }
      if (finInfo.monthlyMainCpeCost) {
        this.monthlyFixedTotal += Number(finInfo.monthlyMainCpeCost);
      }
      if (finInfo.monthlyBackupLlCost) {
        this.monthlyFixedTotal += Number(finInfo.monthlyBackupLlCost);
      }
      if (finInfo.monthlyBackupIpPortCost) {
        this.monthlyFixedTotal += Number(finInfo.monthlyBackupIpPortCost);
      }
      if (finInfo.monthlyBackupCpeCost) {
        this.monthlyFixedTotal += Number(finInfo.monthlyBackupCpeCost);
      }
    }
    this.monthlyTotal$.next(this.monthlyFixedTotal);
  }

  private setCatalogOptionMonthlyTotalCost(): void {
    let total = 0;
    if (this.monthlyCatalogOptions) {
      forEach(this.monthlyCatalogOptions, (value, key) => {
        total += Number(value);
      });
    } else if (this.finInfoCatalogOptions) {
      this.finInfoCatalogOptions.forEach(element => {
        total += Number(element.monthlyCost);
      });
    }
    this.monthlyCatalogOptionsTotal = total;
    this.monthlyTotal$.next(this.monthlyCatalogOptionsTotal);
  }

  private setCatalogOptionsMonthlyDynamicControls(catalogOptions: CatalogOptions[]) {
    if (!catalogOptions || catalogOptions.length === 0) {
      return;
    }
    let stgoNumber: STGONumberDynamic;
    let dynamicControlOptions: DynamicControlOptions<string>;
    this.catalogOptionsMonthlyControls = [];
    catalogOptions.forEach(element => {
      dynamicControlOptions = new DynamicControlOptions(
        DynamicControlType.stgoNumber,
        element.monthlyCost ? element.monthlyCost.toString() : '0',
        element.optionCode,
        element.optionName,
        false,
        0,
        '',
        '18',
        '2'
      );
      stgoNumber = new STGONumberDynamic(dynamicControlOptions);
      this.catalogOptionsMonthlyControls.push(stgoNumber);
    });
  }

  private applySetupCatalogDiscount(): void {
    const total: number = this.setupFixedTotal + this.setupCatalogOptionsTotal;
    if (!this.discount || !this.discount.otcDiscountRate) {
      this.financialInfoForm.patchValue({
        setupOtherDiscount: 0,
        setupTotalCostAfterDiscount: total
      });
      return;
    }
    this.financialInfoForm.patchValue({
      setupOtherDiscount: ((1 - this.discount.otcDiscountRate) * 100).toFixed(2),
      setupTotalCostAfterDiscount: (total * this.discount.otcDiscountRate).toFixed(2)
    });
  }

  private applyMonthlyCatalogDiscount(): void {
    const total: number = this.monthlyFixedTotal + this.monthlyCatalogOptionsTotal;
    if (!this.discount || !this.discount.mrcDiscountRate) {
      this.financialInfoForm.patchValue({
        monthlyOtherDiscount: 0,
        monthlyTotalCostAfterDiscount: total
      });
      return;
    }
    this.financialInfoForm.patchValue({
      monthlyOtherDiscount: ((1 - this.discount.mrcDiscountRate) * 100).toFixed(2),
      monthlyTotalCostAfterDiscount: (total * this.discount.mrcDiscountRate).toFixed(2)
    });
  }

  private getCatalogDiscount(catalogId: number): void {
    if (!catalogId) {
      this.discount = new CatalogDiscount();
      return;
    }
    this.catalogDiscountService.url = '/tempo/discounts/catalogs/';
    this.sub$.add(
      this.catalogDiscountService.getCatalogDiscount(catalogId).subscribe((discount: CatalogDiscount) => {
        if (discount) {
          this.discount = discount;
          this.applySetupCatalogDiscount();
          this.applyMonthlyCatalogDiscount();
        }
      })
    );
  }

  private validateForm(): boolean {
    if (this.financialInfoForm.invalid) {
      Object.keys(this.financialInfoForm.controls).forEach(key => {
        this.financialInfoForm.controls[key].markAllAsTouched();
      });
      return false;
    }
    return true;
  }
}
