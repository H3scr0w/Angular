import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subscription } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { RequestAction, RequestStatus, RequestType } from '../../shared/enums/enum';
import { Action } from '../../shared/models/action';
import { ActiveCommandDTO, CommandsDTO, CommandsFilter } from '../../shared/models/commands';
import { IdName } from '../../shared/models/id-name';
import { Request } from '../../shared/models/request';
import { CommandService } from '../../shared/service/commands/command.service';
import { MessageService } from '../../shared/service/message/message.service';
import { RequestService } from '../../shared/service/request/request.service';
import { RequestResultDialogData } from '../request-make/request-make-dialog/request-make-dialog-data';
import { RequestMakeDialogComponent } from '../request-make/request-make-dialog/request-make-dialog.component';

@Component({
  selector: 'stgo-request-termination',
  templateUrl: './request-termination.component.html',
  styleUrls: ['./request-termination.component.css']
})
export class RequestTerminationComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  advanceFilter: CommandsFilter;
  isLoading = false;
  filterCount = 0;
  private sub$: Subscription = new Subscription();

  searchValue: string;
  totalElements: number;
  commands: ActiveCommandDTO[];
  displayedColumns: string[] = ['orderId', 'actions'];
  panelFilterOpenState = false;
  isAdmin: boolean;
  isPmUser: boolean;
  isOrderUser: boolean;
  requestCancellationForm = this.fb.group({
    sgtSiteCode: [''],
    orderId: ['']
  });

  constructor(
    private authenticationService: AuthenticationService,
    private commandService: CommandService,
    private requestService: RequestService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isPmUser = this.authenticationService.credentials.isPmUser;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  terminateRequest(data: ActiveCommandDTO): void {
    this.isLoading = true;
    this.commandService
      .getOrderByOrderId(data.orderId)
      .pipe(
        finalize(() => (this.isLoading = false)),
        switchMap(result => {
          return this.mapOrderToRequest(result).pipe(
            switchMap(res => {
              this.isLoading = false;
              const req: Request = res;
              this.requestService.getActions().find(value => {
                if (value.id === RequestAction.Termination) {
                  req.action = new Action(value.id, value.name, 'Y');
                }
              });
              const dialogRef = this.dialog.open(RequestMakeDialogComponent, {
                width: '1000px',
                disableClose: true,
                data: { mode: 'terminate', request: req }
              });
              dialogRef.afterClosed().subscribe(saveResult => {
                if (saveResult !== 'close' && saveResult) {
                  const requestResultDialogData: RequestResultDialogData = saveResult;
                  const request: Request = requestResultDialogData.request;
                  if (request && request.id) {
                    this.getActiveCommand(this.advanceFilter);
                    this.messageService.showWithAction(
                      this.translateService.instant('request.make.success.message', { requestId: request.id })
                    );
                  }
                }
              });
              return this.dialog.afterAllClosed;
            })
          );
        })
      )
      .subscribe();
  }

  disableInput(getControl: string): void {
    if (getControl === 'sgtSiteCode') {
      this.requestCancellationForm.get('sgtSiteCode').setValue(null);
    } else {
      this.requestCancellationForm.get('orderId').setValue(null);
    }
  }

  resetAdvanceFilter(): void {
    this.advanceFilter = null;
    this.commands = [];
    this.requestCancellationForm.reset();
  }

  applyAdvanceFilter(): void {
    this.pageIndex = 0;
    if (!this.requestCancellationForm.get('orderId').value && !this.requestCancellationForm.get('sgtSiteCode').value) {
      this.messageService.show(this.translateService.instant('common.advance.filter.msg'), 'error');
    } else if (
      this.requestCancellationForm.get('orderId').value &&
      this.requestCancellationForm.get('orderId').value.length < 15
    ) {
      this.messageService.show(this.translateService.instant('termination.order.filter.msg'), 'error');
    } else {
      this.advanceFilter = Object.assign({}, this.requestCancellationForm.value);
      this.getActiveCommand(this.advanceFilter);
    }
  }

  showRequest(requestId: number): void {
    if (!requestId) {
      return;
    }
    this.isLoading = true;
    this.sub$.add(
      this.requestService
        .getRequestById(requestId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(result => {
          if (result) {
            const dialogRef = this.dialog.open(RequestMakeDialogComponent, {
              width: '1000px',
              data: { mode: 'edit', request: result, showAction: false },
              disableClose: true,
              hasBackdrop: false
            });
            dialogRef.afterClosed().subscribe();
          }
        })
    );
  }

  private getActiveCommand(advancefilter?: CommandsFilter): void {
    this.isLoading = true;
    this.sub$.add(
      this.commandService
        .getActiveCommands(advancefilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(response => {
          this.commands = response;
        })
    );
  }

  private mapOrderToRequest(commad: CommandsDTO): Observable<Request> {
    if (commad.requestId) {
      return this.requestService.getRequestById(commad.requestId).pipe(
        switchMap(result => {
          if (result) {
            return this.getRequest(commad, result);
          }
        })
      );
    } else {
      return this.getRequest(commad, null);
    }
  }

  private getRequest(commad: CommandsDTO, result: Request): Observable<Request> {
    const req: Request = new Request();
    req.orderId = commad.orderId;
    req.id = null;
    req.ownerName = this.authenticationService.credentials.sgid;
    req.creationDate = new Date();
    req.lastUser = this.authenticationService.credentials.sgid;
    req.lastUpdate = new Date();
    req.comments = 'TERMINATION REQUEST for ORDER ID = ' + commad.orderId;
    req.requestType = new IdName(RequestType.Termination);
    req.requestStatus = new IdName(RequestStatus.ValidatedToOrder);
    req.acnParameter = commad.acnParameter ? commad.acnParameter : null;
    req.sgtSiteCode = commad.sgtSiteCode ? commad.sgtSiteCode : null;
    req.network = commad.network ? commad.network : null;
    req.serviceNumber = commad.serviceNumber ? commad.serviceNumber : null;
    req.site = commad.site ? commad.site : null;
    req.siteFixPhone = commad.siteFixPhone ? commad.siteFixPhone : null;
    req.address = commad.address ? commad.address : null;
    req.zipCode = commad.zipCode ? commad.zipCode : null;
    req.city = commad.city ? commad.city : null;
    req.country = commad.country ? commad.country : null;
    req.managementMode = commad.managementMode ? commad.managementMode : null;
    req.priority = commad.priority ? commad.priority : null;
    req.dcrd = commad.dateCrd ? commad.dateCrd : null;
    req.localContact1FirstName = commad.localContact1FirstName ? commad.localContact1FirstName : null;
    req.localContact1LastName = commad.localContact1LastName ? commad.localContact1LastName : null;
    req.localContact1Phone = commad.localContact1Phone ? commad.localContact1Phone : null;
    req.localContact1Mobile = commad.localContact1Mobile ? commad.localContact1Mobile : null;
    req.localContact1Email = commad.localContact1Email ? commad.localContact1Email : null;
    req.localContact2FirstName = commad.localContact2FirstName ? commad.localContact2FirstName : null;
    req.localContact2LastName = commad.localContact2LastName ? commad.localContact2LastName : null;
    req.localContact2Phone = commad.localContact2Phone ? commad.localContact2Phone : null;
    req.localContact2Mobile = commad.localContact2Mobile ? commad.localContact2Mobile : null;
    req.localContact2Email = commad.localContact2Email ? commad.localContact2Mobile : null;
    req.notificationbusinessmail = commad.notificationbusinessmail ? commad.notificationbusinessmail : null;
    req.currency = commad.currency ? commad.currency : null;
    req.catalog = commad.catalog ? commad.catalog : null;
    req.catalogVersion = commad.catalogVersion ? commad.catalogVersion : null;
    req.mainAccessCode = commad.mainAccessCode ? commad.mainAccessCode : null;
    req.backupAccessCode = commad.backupAccessCode ? commad.backupAccessCode : null;
    req.gtrCommitment = commad.gtrCommitment ? Number(commad.gtrCommitment) : null;
    req.dispoCommitment = commad.dispoCommitment ? commad.dispoCommitment : null;
    req.ltcCommitment = commad.ltcCommitment ? Number(commad.ltcCommitment) : null;
    req.connectionCode1 = commad.connectionCode1 ? commad.connectionCode1 : null;
    req.connectionCode2 = commad.connectionCode2 ? commad.connectionCode2 : null;
    req.connectionCode3 = commad.connectionCode3 ? commad.connectionCode3 : null;
    req.routerCode1 = commad.routerCode1 ? commad.routerCode1 : null;
    req.routerCode2 = commad.routerCode2 ? commad.routerCode2 : null;
    req.setupMainLlCost = commad.setupMainLlCost ? Number(commad.setupMainLlCost) : null;
    req.setupMainIpPortCost = commad.setupMainIpPortCost ? Number(commad.setupMainIpPortCost) : null;
    req.setupMainCpeCost = commad.setupMainCpeCost ? Number(commad.setupMainCpeCost) : null;
    req.setupBackupLlCost = commad.setupBackupLlCost ? Number(commad.setupBackupLlCost) : null;
    req.setupBackupIpPortCost = commad.setupBackupIpPortCost ? Number(commad.setupBackupIpPortCost) : null;
    req.setupBackupCpeCost = commad.setupBackupCpeCost ? Number(commad.setupBackupCpeCost) : null;
    req.setupComments = commad.setupComments ? commad.setupComments : null;
    req.setupTotalCost = commad.setupTotalCost ? Number(commad.setupTotalCost) : null;
    req.setupTotalCostTaxes = commad.setupTotalCostTaxes ? Number(commad.setupTotalCostTaxes) : null;
    req.monthlyMainLlCost = commad.monthlyMainLlCost ? Number(commad.monthlyMainLlCost) : null;
    req.monthlyMainIpPortCost = commad.monthlyMainIpPortCost ? Number(commad.monthlyMainIpPortCost) : null;
    req.monthlyMainCpeCost = commad.monthlyMainCpeCost ? Number(commad.monthlyMainCpeCost) : null;
    req.monthlyBackupLlCost = commad.monthlyBackupLlCost ? Number(commad.monthlyBackupLlCost) : null;
    req.monthlyBackupIpPortCost = commad.monthlyBackupIpPortCost ? Number(commad.monthlyBackupIpPortCost) : null;
    req.monthlyBackupCpeCost = commad.monthlyBackupCpeCost ? Number(commad.monthlyBackupCpeCost) : null;
    req.monthlyComments = commad.monthlyComments ? commad.monthlyComments : null;
    req.monthlyTotalCost = commad.monthlyTotalCost ? Number(commad.monthlyTotalCost) : null;
    req.monthlyTotalCostTaxes = commad.monthlyTotalCostTaxes ? Number(commad.monthlyTotalCostTaxes) : null;
    req.operatorsId = commad.operator ? commad.operator : null;
    req.contractId = commad.contractId ? commad.contractId : null;
    req.serviceId = commad.serviceId ? commad.serviceId : null;
    req.monthlyOtherDiscount = commad.monthlyOtherDiscount ? Number(commad.monthlyOtherDiscount) : null;
    req.setupOtherDiscount = commad.setupOtherDiscount ? Number(commad.setupOtherDiscount) : null;
    req.optionCodes = commad.optionCodes ? commad.optionCodes : null;
    req.serviceTitle = commad.serviceTitle ? commad.serviceTitle : null;
    req.replaced = commad.replaced ? commad.replaced : null;
    req.chargebackId = result && result.chargebackId ? result.chargebackId : null;
    req.opertors = commad.operatorDto;
    req.catalogId = commad.catalogId ? commad.catalogId : null;

    return of(req);
  }
}
