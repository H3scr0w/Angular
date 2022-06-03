import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, startWith, switchMap } from 'rxjs/operators';
import { Contact } from '../../../../../../sirene/src/app/shared/models/contact';
import { ContactService } from '../../../../../../sirene/src/app/shared/services/contact/contact.service';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { IspCarrier } from '../../models/isp-carrier';
import { IspInformation } from '../../models/isp-information';
import { EventEmitterService } from '../../service/event-emitter/event-emitter.service';
import { IspBandwidthService } from '../../service/isp-bandwidth/isp-bandwidth.service';
import { IspCarrierService } from '../../service/isp-carrier/isp-carrier.service';
import { MessageService } from '../../service/message/message.service';

@Component({
  selector: 'stgo-isp-information',
  templateUrl: './isp-information.component.html',
  styleUrls: ['./isp-information.component.css']
})
export class IspInformationComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  ispInfo: IspInformation;
  @Input()
  showISPSave = true;

  @Output()
  ispInfoChanged = new EventEmitter<IspInformation>();

  isLoading = false;
  isAdmin: boolean;
  isRsm: boolean;

  isps: Observable<IspCarrier[]>;
  contacts: Observable<Contact[]>;
  inputContact: Subject<string> = new Subject<string>();
  inputISP: Subject<string> = new Subject<string>();

  ispInfoForm = this.fb.group({
    otc: [''],
    mrc: [''],
    currency: [''],
    ispCarrier: [''],
    ispHelpDeskContact: [''],
    sgOrderContact: [''],
    sgOperationalContact: [''],
    sla: [''],
    technology: [''],
    bandwidth: ['']
  });

  private sub$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private ispCarrierService: IspCarrierService,
    private contactService: ContactService,
    private ispBandwidthService: IspBandwidthService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isRsm = this.authenticationService.credentials.isRsm;

    this.ispInfoForm.patchValue({
      ispCarrier: null,
      sgOrderContact: null,
      sgOperationalContact: null
    });

    this.isps = this.inputISP.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.ispCarrierService.getAllIspCarriers(0, 200, 'ispCarrier', 'asc', value, null).pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.contacts = this.inputContact.pipe(
      startWith(''),
      filter(value => value && value.length > 3),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.contactService.getAllContacts(0, 200, 'firstName', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.fullName.localeCompare(b.fullName)));
          })
        );
      })
    );

    this.ispInfoChanged.emit(Object.assign(this.ispInfoForm.value));

    this.ispInfoForm.valueChanges.subscribe(val => {
      const ispInfo: IspInformation = Object.assign(this.ispInfoForm.value);
      if (this.ispInfo) {
        ispInfo.id = this.ispInfo.id;
        ispInfo.order = this.ispInfo.order;
        ispInfo.orderId = this.ispInfo.orderId;
        ispInfo.request = this.ispInfo.request;
        ispInfo.requestId = this.ispInfo.requestId;
        ispInfo.ispCarrierId = this.ispInfo.ispCarrier ? this.ispInfo.ispCarrier.id : null;
      }
      this.ispInfoChanged.emit(ispInfo);
    });

    if (this.eventEmitterService && this.eventEmitterService.invokeFormValidateFunction) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeFormValidateFunction.subscribe(() => {
        this.eventEmitterService.validStatus.push(this.validateForm());
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.ispInfo) {
      return;
    }
    this.ispInfoForm.patchValue({
      otc: this.ispInfo.otc,
      mrc: this.ispInfo.mrc,
      currency: this.ispInfo.currency,
      ispCarrier: this.ispInfo.ispCarrier,
      ispHelpDeskContact: this.ispInfo.ispCarrier ? this.ispInfo.ispCarrier.ispHelpdeskContact : '',
      sgOrderContact: this.ispInfo.sgOrderContact,
      sgOperationalContact: this.ispInfo.sgOperationalContact,
      sla: this.ispInfo.sla,
      technology: this.ispInfo.technology,
      bandwidth: this.ispInfo.bandwidth
    });
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onISPSelected(ispCarrier: IspCarrier): void {
    if (!ispCarrier) {
      return;
    }

    this.ispInfoForm.patchValue({
      ispHelpDeskContact: ispCarrier.ispHelpdeskContact
    });
  }

  onSumbit() {
    if (this.isLoading || this.ispInfoForm.invalid) {
      return;
    }
    this.isLoading = true;
    const ispInfo: IspInformation = Object.assign(this.ispInfoForm.value);
    ispInfo.id = this.ispInfo.id;
    ispInfo.order = this.ispInfo.order;
    ispInfo.orderId = this.ispInfo.orderId;
    ispInfo.request = this.ispInfo.request;
    ispInfo.requestId = this.ispInfo.requestId;
    ispInfo.ispCarrierId = this.ispInfo.ispCarrier ? this.ispInfo.ispCarrier.id : null;
    this.sub$.add(
      this.ispBandwidthService
        .addIspBandwidth(ispInfo)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          if (res) {
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          }
        })
    );
  }

  hasError(controlName: string, errorName: string): boolean {
    if (errorName === 'pattern' && !this.ispInfoForm.controls[controlName].hasError('required')) {
      return this.ispInfoForm.controls[controlName].hasError(errorName);
    }
    return this.ispInfoForm.controls[controlName].hasError(errorName);
  }

  private validateForm(): boolean {
    if (this.ispInfoForm.invalid) {
      Object.keys(this.ispInfoForm.controls).forEach(key => {
        this.ispInfoForm.controls[key].markAllAsTouched();
      });
      return false;
    }
    return true;
  }
}
