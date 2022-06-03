import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../core';
import { CommandsDTOForChangeService, CommandsFilter } from '../../shared/models/commands';
import { CommandService } from '../../shared/service/commands/command.service';
import { MessageService } from '../../shared/service/message/message.service';

export class Email {
  email: string;
  constructor(email: string) {
    this.email = email;
  }
}
@Component({
  selector: 'stgo-change-services',
  templateUrl: './change-services.component.html',
  styleUrls: ['./change-services.component.css']
})
export class ChangeServicesComponent implements OnInit {
  isLoading: boolean;
  isAdmin: boolean;
  commandsFilter: CommandsFilter;
  orderIds: Observable<string[]>;
  inputOrder: Subject<string> = new Subject<string>();
  isNotify = false;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: Email[] = [];

  private sub$: Subscription = new Subscription();

  changeServicesForm = this.fb.group({
    id: [''],
    orderId: ['', [Validators.required, Validators.minLength(1)]],
    oldMainAccessCode: [''],
    oldBackupAccessCode: [''],
    mainAccessCode: ['', [Validators.required, Validators.minLength(1)]],
    backupAccessCode: [''],
    notify: [''],
    emails: ['', [Validators.email]]
  });

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private commandService: CommandService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.changeServicesForm.controls.oldMainAccessCode.disable();
    this.changeServicesForm.controls.oldBackupAccessCode.disable();
    this.changeServicesForm.get('orderId').setValue(null);

    this.orderIds = this.inputOrder.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        this.commandsFilter = new CommandsFilter();
        this.commandsFilter.skip = true;
        return this.commandService.getAllCommands(value, 0, 20, 'orderId', 'asc', this.commandsFilter).pipe(
          finalize(() => (this.isLoading = false)),
          switchMap(result => {
            return of(result.content.map(order => order.orderId).sort((a, b) => a.localeCompare(b)));
          })
        );
      })
    );
  }

  public onOrderIdSelected(): void {
    if (this.changeServicesForm.controls.orderId.value) {
      this.isLoading = true;
      this.sub$.add(
        this.commandService
          .getCommandByOrderId(this.changeServicesForm.controls.orderId.value)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.changeServicesForm.patchValue({
              id: res.id,
              oldMainAccessCode: res.mainAccessCode,
              oldBackupAccessCode: res.backupAccessCode
            });
          })
      );
    }
  }

  onSubmit(): void {
    if (this.changeServicesForm.valid) {
      this.isLoading = true;

      const queryemails = this.emails
        .map(element => {
          return element.email;
        })
        .join(';');

      const command: CommandsDTOForChangeService = new CommandsDTOForChangeService(
        this.changeServicesForm.controls.id.value,
        this.changeServicesForm.controls.orderId.value,
        this.changeServicesForm.controls.mainAccessCode.value,
        this.changeServicesForm.controls.backupAccessCode.value,
        this.changeServicesForm.controls.notify.value,
        queryemails
      );
      this.sub$.add(
        this.commandService
          .editCommandService(command)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.changeServicesForm.reset();
            this.emails = [];
            this.isNotify = false;
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          })
      );
    }
  }

  toggleDisplay() {
    this.isNotify = !this.isNotify;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (value.trim()) {
      this.emails.push({ email: value.trim() });
    }
    if (input) {
      input.value = '';
    }
  }

  remove(email: Email): void {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
      this.changeServicesForm.markAsDirty();
    }
  }
}
