import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, Page } from '@shared';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Contact } from '../../../shared/models/contact';
import { Country, CountryFilter } from '../../../shared/models/country';
import { Profile } from '../../../shared/models/profile';
import { ContactService } from '../../../shared/services/contact/contact.service';
import { CountryService } from '../../../shared/services/country/country.service';
import { ProfileService } from '../../../shared/services/profile/profile.service';
import { ContactDialogData } from './contact-dialog-data';

@Component({
  selector: 'stgo-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  profiles: Profile[];
  countries: Observable<Country[]>;
  countryFilter: CountryFilter;
  rsmProfileLowerCase = environment.rsmProfileName.toLocaleLowerCase();
  inputCountry: Subject<string> = new Subject<string>();

  contactForm = this.fb.group({
    id: [''],
    title: [''],
    name: [''],
    firstName: [''],
    email: [''],
    login: [''],
    fixPhone: [''],
    mobilePhone: [''],
    profile: ['', Validators.required],
    countries: ['']
  });

  private saveSubscription: Subscription;

  constructor(
    private messageService: MessageService,
    private contactService: ContactService,
    private profileService: ProfileService,
    private countryService: CountryService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactDialogData
  ) {}

  ngOnInit() {
    this.countries = this.inputCountry.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.countryFilter = new CountryFilter();
        if (value) {
          this.countryFilter.name = value;
        }
        this.countryFilter.skip = true;
        return this.countryService.getAllCountries(null, 0, 200, 'name', 'asc', this.countryFilter).pipe(
          switchMap(result => {
            if (this.data.contact.countrySupervised) {
              this.contactForm.controls.countries.setValue(
                this.data.contact.countrySupervised
                  .split(';')
                  .map(countryCode => result.content.find(country => country.id === countryCode))
              );
            }
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          })
        );
      })
    );

    if (this.data && this.data.mode === 'edit') {
      this.contactForm.setValue({
        id: !this.data.contact.id ? 0 : this.data.contact.id,
        title: !this.data.contact.title ? '' : this.data.contact.title,
        name: this.data.contact.name,
        firstName: this.data.contact.firstName,
        email: this.data.contact.email,
        login: !this.data.contact.login ? '' : this.data.contact.login,
        fixPhone: !this.data.contact.fixPhone ? '' : this.data.contact.fixPhone,
        mobilePhone: !this.data.contact.mobilePhone ? '' : this.data.contact.mobilePhone,
        profile: !this.data.contact.profile ? null : this.data.contact.profile,
        countries: this.contactForm.controls.countries.value
      });
    } else if (this.data && this.data.isContactAlreadyRequested) {
      this.contactForm.setValue({
        id: null,
        title: null,
        name: this.data.contact.name,
        firstName: this.data.contact.firstName,
        email: this.data.contact.email,
        login: null,
        fixPhone: !this.data.contact.fixPhone ? '' : this.data.contact.fixPhone,
        mobilePhone: !this.data.contact.mobilePhone ? '' : this.data.contact.mobilePhone,
        profile: null,
        countries: null
      });
    } else {
      this.contactForm.controls.profile.setValue(null);
      this.contactForm.controls.countries.setValue(null);
    }

    this.profileService.getAllProfiles(0, 20).subscribe((page: Page<Profile>) => {
      if (page) {
        this.profiles = page.content.filter(profile => profile.name != null);
        if (this.data && this.data.role === 'rsm') {
          this.data.contact.profile = this.profiles.find(
            profile => profile.name.toLocaleLowerCase() === this.rsmProfileLowerCase
          );
          this.contactForm.controls.profile.setValue(this.data.contact.profile);
        } else if (this.data && this.data.mode !== 'edit') {
          this.contactForm.controls.profile.setValue(this.profiles.find(profile => profile.id === 7));
        } else if (this.data && this.data.mode === 'edit' && this.contactForm.controls.profile.value === null) {
          this.contactForm.controls.profile.setValue(this.profiles.find(profile => profile.id === 7));
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  onProfileSelected(profile: Profile): void {
    this.data.contact.profile = profile;
    if (profile && profile.name.toLocaleLowerCase() !== this.rsmProfileLowerCase) {
      this.contactForm.controls.countries.setValue(null);
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.contactForm.controls[controlName].hasError(errorName) && this.contactForm.controls[controlName].touched;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      const contact: Contact = Object.assign({}, this.contactForm.value);

      if (this.contactForm.controls.countries && this.contactForm.controls.countries.value) {
        const countries: Country[] = this.contactForm.controls.countries.value;
        contact.countrySupervised = countries.map(country => country.id).join(';');
      }

      if (this.data && this.data.isContactRequested) {
        contact.id = null;
        contact.fullName = contact.firstName + ' ' + contact.name;
        this.dialogRef.close(contact);
      } else {
        if (this.data && this.data.mode === 'add') {
          this.saveSubscription = this.contactService
            .addContact(contact)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              if (res) {
                res.fullName = res.firstName + ' ' + res.name;
                this.dialogRef.close(res);
                this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
              }
            });
        } else {
          this.saveSubscription = this.contactService
            .editContact(contact)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            });
        }
      }
    }
  }

  onCloseClick(): void {
    this.dialogRef.close('close');
  }
}
