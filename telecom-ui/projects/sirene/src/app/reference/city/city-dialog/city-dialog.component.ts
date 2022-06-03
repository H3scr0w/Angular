import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { City, CityService, Country, CountryFilter, CountryService, MessageService } from '@shared';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { CityDialogData } from './city-dialog-data';
import { CityValidator } from './city-validator';

@Component({
  selector: 'stgo-city-dialog',
  templateUrl: './city-dialog.component.html',
  styleUrls: ['./city-dialog.component.scss']
})
export class CityDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  countries: Observable<Country[]>;
  inputCountry: Subject<string> = new Subject<string>();

  cityForm = this.fb.group({
    id: [''],
    name: [
      '',
      {
        validators: [Validators.required]
      }
    ],
    country: ['', Validators.required]
  });

  private sub$: Subscription = new Subscription();

  constructor(
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private countryService: CountryService,
    private cityService: CityService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CityDialogData
  ) {}

  ngOnInit() {
    if (this.data) {
      this.cityForm.setValue({
        id: !this.data.city.id ? 0 : this.data.city.id,
        name: this.data.city.name,
        country: !this.data.city.country ? null : this.data.city.country
      });
      if (this.data.mode === 'edit') {
        this.cityForm
          .get('name')
          .setAsyncValidators([
            CityValidator.validateCityNameNotTaken(this.cityService, this.cityForm, this.cityForm.get('name').value)
          ]);
      } else {
        this.cityForm
          .get('name')
          .setAsyncValidators([CityValidator.validateCityNameNotTaken(this.cityService, this.cityForm, null)]);
        if (this.data.city.country && !this.data.city.country.id) {
          this.cityForm.controls.country.setValue(null);
        }
      }
    }

    this.sub$.add(
      this.cityForm.controls.name.valueChanges
        .pipe(startWith(''), debounceTime(200), distinctUntilChanged())
        .subscribe(value => {
          this.cityForm.controls.name.updateValueAndValidity();
        })
    );

    this.sub$.add(
      this.cityForm.controls.country.valueChanges
        .pipe(startWith(''), debounceTime(200), distinctUntilChanged())
        .subscribe(value => {
          this.cityForm.controls.name.updateValueAndValidity();
        })
    );

    this.countries = this.inputCountry.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        const countryFilter: CountryFilter = new CountryFilter();
        if (value) {
          countryFilter.name = value;
        }
        countryFilter.skip = true;
        return this.countryService.getAllCountries('', 0, 200, 'name', 'asc', countryFilter).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          }),
          finalize(() => (this.isLoading = false))
        );
      })
    );
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.cityForm.valid) {
      this.isLoading = true;
      const city: City = Object.assign({}, this.cityForm.value);
      city.lastUser = this.authenticationService.credentials.sgid;
      if (this.data.isCityRequested) {
        city.id = null;
        this.dialogRef.close({ data: city });
      } else {
        if (this.data && this.data.mode === 'add') {
          this.sub$.add(
            this.cityService
              .addCity(city)
              .pipe(finalize(() => (this.isLoading = false)))
              .subscribe(res => {
                if (res) {
                  this.dialogRef.close({ data: res });
                  this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
                }
              })
          );
        } else {
          this.sub$.add(
            this.cityService
              .editCity(city)
              .pipe(finalize(() => (this.isLoading = false)))
              .subscribe(res => {
                this.dialogRef.close();
                this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
              })
          );
        }
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  hasError = (controlName: string, errorName: string) => {
    if (controlName === 'country') {
      const selectedcountry: Country = this.cityForm.controls[controlName].value;
      if (typeof selectedcountry !== 'object') {
        return this.cityForm.controls[controlName].setErrors({ required: true });
      }
    }
    return this.cityForm.controls[controlName].hasError(errorName) && this.cityForm.controls[controlName].touched;
  };
}
