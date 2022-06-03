import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, startWith, switchMap } from 'rxjs/operators';
import { Site, SiteService } from '../../../../../../sirene/src/app/shared';
import { SiteInfo } from '../../models/site-info';
import { EventEmitterService } from '../../service/event-emitter/event-emitter.service';

@Component({
  selector: 'stgo-site-info',
  templateUrl: './site-info.component.html',
  styleUrls: ['./site-info.component.css']
})
export class SiteInfoComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  siteCurrent: SiteInfo;
  @Input()
  isReadOnly = false;
  @Input()
  isReset = false;
  @Output()
  pstnChanged = new EventEmitter<string>();
  @Output()
  siteChanged = new EventEmitter<SiteInfo>();

  isLoading = false;
  sites: Observable<Site[]>;
  inputSiteCode: Subject<string> = new Subject<string>();

  siteInfoForm = this.formBuilder.group({
    siteCode: [''],
    siteName: [''],
    sitePhone: [''],
    siteAddress: [''],
    siteZipCode: [''],
    siteCity: [''],
    siteCountry: [''],
    sitePSTN: ['']
  });

  private sub$: Subscription = new Subscription();

  constructor(
    private siteService: SiteService,
    private formBuilder: FormBuilder,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.siteService.url = '/sirene/sites';

    this.siteInfoForm.patchValue({
      siteCode: null
    });

    this.sites = this.inputSiteCode.pipe(
      startWith(''),
      filter(value => value && value.length > 3),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        return this.siteService.getAllSites(0, 50, 'siteCode', 'asc', value.trim()).pipe(
          switchMap(result => {
            return of(result.content);
          }),
          finalize(() => (this.isLoading = false))
        );
      })
    );

    if (this.siteCurrent && this.siteCurrent.siteCode) {
      this.siteInfoForm.patchValue({
        siteCode: this.siteCurrent,
        siteName: this.siteCurrent.siteName,
        sitePhone: this.siteCurrent.sitePhone,
        siteAddress: this.siteCurrent.siteAddress,
        siteZipCode: this.siteCurrent.siteZipCode,
        siteCity: this.siteCurrent.siteCity,
        siteCountry: this.siteCurrent.siteCountry,
        sitePSTN: this.siteCurrent.sitePSTN != null ? this.siteCurrent.sitePSTN : ''
      });
    }

    this.siteInfoForm.get('sitePSTN').valueChanges.subscribe(val => {
      this.pstnChanged.emit(val);
    });

    if (this.eventEmitterService && this.eventEmitterService.invokeFormValidateFunction) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeFormValidateFunction.subscribe(() => {
        this.eventEmitterService.validStatus.push(this.validateForm());
      });
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isReset) {
      this.siteInfoForm.reset();
      this.isReset = false;
    }
  }

  onSiteSelected(site: Site) {
    if (!site) {
      this.siteInfoForm.reset();
      const siteInfo: SiteInfo = Object.assign(this.siteInfoForm.value);
      this.siteChanged.emit(siteInfo);
      return;
    }

    this.setSiteByCode(site.siteCode);
  }

  hasError(controlName: string, errorName: string): boolean {
    return (
      this.siteInfoForm.controls[controlName].hasError(errorName) && this.siteInfoForm.controls[controlName].touched
    );
  }

  reloadSiteAddress(): void {
    if (!this.siteCurrent && !this.siteCurrent.siteCode) {
      return;
    }
    this.setSiteByCode(this.siteCurrent.siteCode);
  }

  private validateForm(): boolean {
    if (this.siteInfoForm.invalid) {
      Object.keys(this.siteInfoForm.controls).forEach(key => {
        this.siteInfoForm.controls[key].markAllAsTouched();
      });
      return false;
    }
    return true;
  }

  private setSiteByCode(siteCode: string): void {
    if (siteCode) {
      this.isLoading = true;
      this.sub$.add(
        this.siteService
          .getSiteById(siteCode)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(site => {
            if (site) {
              this.siteInfoForm.patchValue({
                siteCode: site,
                sitePSTN: site.pstnNumber !== null && site.pstnNumber !== 'undefined' ? site.pstnNumber : '',
                siteName: site.siteCode + '-' + site.city.name + '-' + site.company.companyName + '-' + site.usualName,
                sitePhone: site.siteFixePhone,
                siteAddress: site.address1,
                siteZipCode: site.postCode,
                siteCity: site.city.name,
                siteCountry: site.city.country.name
              });
              const siteInfo: SiteInfo = Object.assign(this.siteInfoForm.value);
              siteInfo.itManager = site.itManager ? site.itManager.fullName : '';
              siteInfo.siteCode = site.siteCode;
              this.siteChanged.emit(siteInfo);
            }
          })
      );
    }
  }
}
