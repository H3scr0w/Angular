import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { of, BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../core';
import { CommandsDTO, CommandsFilter } from '../../shared/models/commands';
import { Page } from '../../shared/models/page.model';
import { TelecomService } from '../../shared/models/telecom-service-selector';
import { CommandService } from '../../shared/service/commands/command.service';
import { MessageService } from '../../shared/service/message/message.service';

@Component({
  selector: 'stgo-catalog-replacement',
  templateUrl: './catalog-replacement.component.html',
  styleUrls: ['./catalog-replacement.component.css']
})
export class CatalogReplacementComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  @ViewChild('stepper')
  stepper: MatStepper;
  isLoading = false;
  isNextButtonHide = true;
  isLinear = true;
  countryCode = '';
  operatorId: number;
  commands: CommandsDTO[] = [];
  updateCommands: CommandsDTO[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = [
    'orderId',
    'action',
    'operator',
    'serviceTitle',
    'mainServiceCode',
    'backupServiceCode',
    'optionCodes',
    'setupTotalCost',
    'monthlyTotalCost',
    'currency'
  ];
  isAdmin: boolean;
  advanceFilter: CommandsFilter;
  orderIds: Observable<string[]>;
  inputOrder: Subject<string> = new Subject<string>();
  dataSource = new BehaviorSubject([]);

  private sub$: Subscription = new Subscription();

  catalogAdvanceFilterForm = this.fb.group({
    orderId: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    private cdRef: ChangeDetectorRef,
    private commandService: CommandService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.catalogAdvanceFilterForm = this.fb.group({
      orderId: ['', Validators.required]
    });

    this.catalogAdvanceFilterForm.get('orderId').setValue(null);
    this.orderIds = this.inputOrder.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        this.advanceFilter = new CommandsFilter();
        this.advanceFilter.skip = true;
        return this.commandService.getAllCommands(value, 0, 20, 'orderId', 'asc', this.advanceFilter).pipe(
          finalize(() => (this.isLoading = false)),
          switchMap(result => {
            return of(result.content.map(order => order.orderId).sort((a, b) => a.localeCompare(b)));
          })
        );
      })
    );
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onServiceSelected(service: TelecomService): void {
    const newCommandRow: CommandsDTO = new CommandsDTO();

    if (this.commands.length > 0 && this.commands[0].operatorDto) {
      (newCommandRow.operatorDto.name = this.commands[0].operatorDto.name),
        (newCommandRow.id = this.commands[0].id),
        (newCommandRow.orderId = this.commands[0].orderId),
        (newCommandRow.action = this.commands[0].action),
        (newCommandRow.serviceTitle = service.serviceTitle),
        (newCommandRow.mainAccessCode = service.mainServiceCode),
        (newCommandRow.backupAccessCode = service.backupServiceCode),
        (newCommandRow.optionCodes = service.optionsAvailables),
        (newCommandRow.serviceId = service.id),
        (newCommandRow.setupTotalCost = this.commands[0].setupTotalCost),
        (newCommandRow.monthlyTotalCost = this.commands[0].monthlyTotalCost),
        (newCommandRow.currency = service.currency),
        (newCommandRow.acnParameter = this.commands[0].acnParameter);
    }

    if (this.commands.length > 0) {
      this.updateCommands.push(this.commands[0]);
      this.updateCommands.push(newCommandRow);
      this.dataSource.next(this.updateCommands);
      this.cdRef.detectChanges();
    }
    this.stepper.next();
  }

  updateCommandCatalog(): void {
    const commandCatalog = this.updateCommands[1];
    this.sub$.add(
      this.commandService
        .editCommandCatalog(commandCatalog)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
        })
    );
    this.resetForm();
    this.cdRef.detectChanges();
  }

  applyAdvanceFilter(): void {
    this.pageIndex = 0;
    this.searchValue = null;
    this.isNextButtonHide = true;
    this.advanceFilter = Object.assign({}, this.catalogAdvanceFilterForm.value);
    this.countryCode = this.catalogAdvanceFilterForm.controls.orderId.value
      ? this.catalogAdvanceFilterForm.controls.orderId.value.substring(0, 2)
      : '';
    this.getAllCommands(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  private resetForm(): void {
    this.commands = [];
    this.updateCommands = [];
    this.dataSource.next(this.updateCommands);
    this.totalElements = 0;
    this.catalogAdvanceFilterForm.patchValue({
      orderId: null
    });
    this.stepper.selectedIndex = 0;
    this.isNextButtonHide = true;
  }

  clearDataOnPrevious(): void {
    this.updateCommands = [];
    this.dataSource.next(this.updateCommands);
  }

  private getAllCommands(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    commandFilter?: CommandsFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.commandService
        .getAllCommands(search, this.pageIndex, this.pageSize, sortField, sortDirection, commandFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<CommandsDTO>) => {
          if (page) {
            this.commands = page.content;
            this.totalElements = page.totalElements;
            this.isNextButtonHide = this.totalElements === 0 ? true : false;
            this.operatorId = this.commands && this.commands.length >= 1 ? this.commands[0].operator : null;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
