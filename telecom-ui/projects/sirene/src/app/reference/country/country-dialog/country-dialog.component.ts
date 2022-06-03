import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Country, CountryService, Delegation, DelegationService, MessageService } from '@shared';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { DialogData } from '../country-list/country-list.component';
import { CountryValidator } from './country-validator';

@Component({
  selector: 'stgo-country-dialog',
  templateUrl: './country-dialog.component.html',
  styleUrls: ['./country-dialog.component.css']
})
export class CountryDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  delegations: Observable<Delegation[]>;
  private saveSubscription: Subscription;
  inputDelegation: Subject<string> = new Subject<string>();
  countryForm = this.fb.group({
    initials: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(2)],
        asyncValidators: [CountryValidator.validateCountryIdNotTaken(this.countryService, null)],
        updateOn: 'blur'
      }
    ],
    name: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [CountryValidator.validateCountryNameNotTaken(this.countryService, null)],
        updateOn: 'blur'
      }
    ],
    delegation: [
      '',
      {
        validators: [Validators.required]
      }
    ]
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CountryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private messageService: MessageService,
    private countryService: CountryService,
    private delegationService: DelegationService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    if (this.data) {
      this.countryForm.setValue({
        name: this.data.country.name,
        initials: this.data.country.id,
        delegation: this.data.country.delegation
      });
      if (this.data.mode === 'edit') {
        this.countryForm
          .get('initials')
          .setAsyncValidators([
            CountryValidator.validateCountryIdNotTaken(this.countryService, this.countryForm.get('initials').value)
          ]);
        this.countryForm
          .get('name')
          .setAsyncValidators([
            CountryValidator.validateCountryNameNotTaken(this.countryService, this.countryForm.get('name').value)
          ]);
      }
      if (this.data.mode === 'add') {
        this.countryForm.controls.delegation.setValue(null);
      }
    }
    this.delegations = this.inputDelegation.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.delegationService.getAllDelegations(query, null, 0, 50, 'name', 'asc').pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );
  }

  ngOnDestroy() {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.countryForm.controls[controlName].hasError(errorName);
  };

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  onInitialsInput(input: string) {
    this.countryForm.get('initials').setValue(input.toUpperCase());
  }

  onSubmit() {
    if (this.countryForm.valid) {
      this.isLoading = true;
      const country: Country = Object.assign(this.countryForm.value);
      country.id = this.countryForm.controls.initials.value;
      if (this.data && this.data.mode === 'add') {
        this.saveSubscription = this.countryService
          .addCountry(country)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          });
      } else {
        this.saveSubscription = this.countryService
          .editCountry(country)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          });
      }
    }
  }
}
