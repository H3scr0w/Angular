import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CancellationDTO, Commands, CommandsFilter } from '../../../shared/models/commands';
import { CommandService } from '../../../shared/service/commands/command.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { RequestCancellationDialogComponent } from '../request-cancellation-dialog/request-cancellation-dialog.component';

@Component({
  selector: 'stgo-request-cancellation-list',
  templateUrl: './request-cancellation-list.component.html',
  styleUrls: ['./request-cancellation-list.component.css']
})
export class RequestCancellationListComponent implements OnInit, OnDestroy {
  advanceFilter: CommandsFilter;
  isLoading = false;
  filterCount = 0;
  private sub$: Subscription = new Subscription();

  searchValue: string;
  cancellationDTO: CancellationDTO[];
  displayedColumns: string[] = ['id', 'orderId', 'actions'];
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

  resetAdvanceFilter(): void {
    this.advanceFilter = null;
    this.cancellationDTO = [];
    this.requestCancellationForm.reset();
  }

  applyAdvanceFilter(): void {
    if (!this.requestCancellationForm.get('orderId').value && !this.requestCancellationForm.get('sgtSiteCode').value) {
      this.messageService.show(this.translateService.instant('common.advance.filter.msg'), 'error');
    } else if (
      this.requestCancellationForm.get('orderId').value &&
      this.requestCancellationForm.get('orderId').value.length < 15
    ) {
      this.messageService.show(this.translateService.instant('termination.order.filter.msg'), 'error');
    } else {
      this.advanceFilter = Object.assign({}, this.requestCancellationForm.value);
      this.getCommandCancellation(this.advanceFilter);
    }
  }

  cancelRequest(data: Commands): void {
    this.dialog
      .open(RequestCancellationDialogComponent, {
        width: '800px',
        disableClose: true,
        data: { commands: data, mode: 'edit' }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.getCommandCancellation(this.advanceFilter);
        }
      });
  }

  disableInput(getControl: string): void {
    if (getControl === 'sgtSiteCode') {
      this.requestCancellationForm.get('sgtSiteCode').setValue(null);
    } else {
      this.requestCancellationForm.get('orderId').setValue(null);
    }
  }

  private getCommandCancellation(advancefilter?: CommandsFilter): void {
    this.isLoading = true;
    this.sub$.add(
      this.commandService
        .getAllCommandsForCancellation(advancefilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(response => {
          this.cancellationDTO = response;
        })
    );
  }
}
