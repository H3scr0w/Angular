import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort, SortDirection } from '@angular/material/sort';
import { SegmentationFilter } from './../../../shared/models/segmentation.model';

import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { CityDialogData } from '../../../reference/city/city-dialog/city-dialog-data';
import { CityDialogComponent } from '../../../reference/city/city-dialog/city-dialog.component';
import {
  City,
  CityFilter,
  CityService,
  Company,
  CompanyFilter,
  CompanyService,
  Country,
  CountryFilter,
  CountryService,
  MessageService,
  Page,
  Sector,
  SectorService,
  Site,
  SiteFilter,
  SiteService,
  SiteType,
  SiteTypeService,
  TimeZone,
  Zone,
  ZoneFilter,
  ZoneService
} from '../../../shared';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { Application } from '../../../shared/models/application';
import { Attachedfiles } from '../../../shared/models/attachedfiles.model';
import { Contact, ContactFilter } from '../../../shared/models/contact';
import { Profile } from '../../../shared/models/profile';
import { Segmentation } from '../../../shared/models/segmentation.model';
import { ApplicationService } from '../../../shared/services/application/application.service';
import { ContactService } from '../../../shared/services/contact/contact.service';
import { SegmentationService } from '../../../shared/services/segmentation/segmentation.service';
import { TimeZoneService } from '../../../shared/services/time-zone/time-zone.service';
import { TimezoneValidators } from '../../../shared/validator/timezone-validator';
import { ContactDialogData } from '../../contact/contact-dialog/contact-dialog-data';
import { ContactDialogComponent } from '../../contact/contact-dialog/contact-dialog.component';

@Component({
  selector: 'stgo-site-list-dialog',
  templateUrl: './site-dialog.component.html',
  styleUrls: ['./site-dialog.component.scss']
})
export class SiteDialogComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(FileUploadComponent) fileUploadComponent: FileUploadComponent;
  pageIndex = 0;
  pageSize = 10;
  advanceFilter: SiteFilter;
  cityDialogData: CityDialogData = { mode: 'add', city: new City(), isCityRequested: false };
  contactDialogData: ContactDialogData = {
    contact: new Contact(),
    mode: 'add',
    isContactRequested: false,
    isContactAlreadyRequested: false,
    role: null
  };
  isLoading = false;
  isLoadingSite = false;
  isLoadingOldSite = false;
  oldSites: Observable<Site[]>;
  siteTypes: Observable<SiteType[]>;
  sifCodes: Observable<Company[]>;
  zones: Zone[];
  sectors: Observable<Sector[]>;
  companies: Company[];
  segmentations: Segmentation[];
  countries: Observable<Country[]>;
  cities: City[];
  selectedCity: City;
  timezones: TimeZone[];
  timeZoneFilter: TimeZone = new TimeZone();
  itManagers: Observable<Contact[]>;
  rsms: Observable<Contact[]>;
  securityContacts: Observable<Contact[]>;
  telephonyContacts: Observable<Contact[]>;
  videos: string[] = ['Yes', 'No', 'Yes Partially'];
  applications: Application[];
  isTemporaryUnknownAddress = false;
  isNotAutomaticArchived = false;
  attachedFiles: Attachedfiles[] = [];
  showFileUploadButton = false;
  displayedColumns: string[] = ['fileName', 'application', 'actions'];
  displayedSiteColumns: string[] = ['siteName'];
  panelFilterSite = false;
  disableSiteSearch = false;
  sites: Site[] = [];
  fileList: File[];
  totalElements: number;
  isViewOnly = false;
  isAdmin: boolean;
  isRsm: boolean;
  inputOldSite: Subject<string> = new Subject<string>();
  inputSiteType: Subject<string> = new Subject<string>();
  inputSifCode: Subject<string> = new Subject<string>();
  inputSector: Subject<string> = new Subject<string>();
  inputZone: Subject<string> = new Subject<string>();
  inputCompany: Subject<string> = new Subject<string>();
  inputSegmentation: Subject<string> = new Subject<string>();
  inputCountry: Subject<string> = new Subject<string>();
  inputCity: Subject<string> = new Subject<string>();
  inputTimeZone: Subject<string> = new Subject<string>();
  inputITManager: Subject<string> = new Subject<string>();
  inputRsm: Subject<string> = new Subject<string>();
  inputSecurityContact: Subject<string> = new Subject<string>();
  inputTelephonyContact: Subject<string> = new Subject<string>();
  siteForm: FormGroup;
  private sub$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SiteDialogComponent>,
    private siteService: SiteService,
    private siteTypeService: SiteTypeService,
    private sectorService: SectorService,
    private zoneService: ZoneService,
    private companyService: CompanyService,
    private segmentationService: SegmentationService,
    private countryService: CountryService,
    private cityService: CityService,
    private contactService: ContactService,
    private applicationService: ApplicationService,
    private timeZoneService: TimeZoneService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isRsm = this.authenticationService.credentials.isRsm;

    this.siteForm = this.formBuilder.group({
      siteCode: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      siteName: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      oldSiteObj: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      statusSite: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      updateStatusDate: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      siteOperatorOnSite: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      siteType: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      siteFixePhone: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      usualName: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      sifCode: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      sector: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      zone: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      company: [{ value: '', disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      segmentations: [{ value: '', disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      backbone: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      address1: [{ value: '', disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      tempUnknownAddress: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      address2: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      address3: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      longitude: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      latitude: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      country: [{ value: '', disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      postCode: [{ value: '', disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      city: [{ value: '', disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      timeZoneId: [{ value: '', disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      itManager: [{ value: null, disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      rsm: [{ value: null, disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      securityContact: [{ value: null, disabled: !this.isAdmin && !this.isRsm }],
      telephonyContact: [{ value: null, disabled: !this.isAdmin && !this.isRsm }],
      doNotArchiveSite: [{ value: null, disabled: !this.isAdmin && !this.isRsm }],
      comments: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      numberUsers: [{ value: '', disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      pstnNumber: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      secondPhoneNo: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      isVideo: [{ value: null, disabled: !this.isAdmin && !this.isRsm }, Validators.required],
      application: [{ value: null, disabled: !this.isAdmin && !this.isRsm }]
    });

    if (this.data && this.data.mode.trim() === 'view') {
      this.isViewOnly = true;
    }

    this.oldSites = this.inputOldSite.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoadingOldSite = true;
        return this.siteService.getAllSites(0, 50, '', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.siteCode.localeCompare(b.siteCode)));
          }),
          finalize(() => (this.isLoadingOldSite = false))
        );
      })
    );

    this.siteTypes = this.inputSiteType.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.siteTypeService.getAllSiteTypes(value, 0, 50).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          })
        );
      })
    );

    this.sifCodes = this.inputSifCode.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.companyService.getAllCompanies(value, 0, 50).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.sifCode.localeCompare(b.sifCode)));
          })
        );
      })
    );

    this.sectors = this.inputSector.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.sectorService.getAllSectors(value, 0, 50, 'name', 'asc').pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.inputZone.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      const selectedSector: Sector = this.siteForm.get('sector').value;
      const zoneFilter: ZoneFilter = new ZoneFilter();
      if (selectedSector && typeof selectedSector === 'object' && selectedSector.id) {
        zoneFilter.sector = selectedSector;
      }
      if (value) {
        zoneFilter.name = value;
      }
      this.getAllZones(zoneFilter);
    });

    this.inputCompany.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      const selectedZone: Zone = this.siteForm.get('zone').value;
      const companyFilter: CompanyFilter = new CompanyFilter();
      if (selectedZone && selectedZone.id) {
        companyFilter.zone = selectedZone;
      }
      if (value) {
        companyFilter.companyName = value;
      }
      this.getAllCompanies(companyFilter);
    });

    this.inputSegmentation.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      const segmentationFilter: SegmentationFilter = new SegmentationFilter();

      if (value) {
        segmentationFilter.name = value;
      }
      this.getAllSegmentations(segmentationFilter);
    });

    this.countries = this.inputCountry.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        const countryFilter = new CountryFilter();
        if (value) {
          countryFilter.name = value;
        }
        countryFilter.skip = true;
        return this.countryService.getAllCountries(null, 0, 200, 'name', 'asc', countryFilter).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          })
        );
      })
    );

    this.inputCity.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe((value: string) => {
      const selectedCountry: Country = this.siteForm.get('country').value;
      const cityFilter: CityFilter = new CityFilter();
      cityFilter.skip = true;
      if (selectedCountry && selectedCountry.id) {
        cityFilter.country = selectedCountry;
      }
      if (value) {
        cityFilter.name = value;
      }
      this.getAllCities(cityFilter);
    });

    this.itManagers = this.inputITManager.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.contactService.getAllContacts(0, 200, '', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.fullName.localeCompare(b.fullName)));
          })
        );
      })
    );

    this.rsms = this.inputRsm.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.getAllRsms();
      })
    );

    this.securityContacts = this.inputSecurityContact.pipe(
      startWith(''),
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

    this.telephonyContacts = this.inputTelephonyContact.pipe(
      startWith(''),
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

    this.applications = this.applicationService.getAllApplications();

    if (this.data && (this.data.mode.trim() === 'edit' || this.isViewOnly)) {
      this.isLoadingSite = true;
      this.sub$.add(
        this.siteService
          .getSiteById(this.data.site)
          .pipe(finalize(() => (this.isLoadingSite = false)))
          .subscribe(sites => {
            if (sites.city) {
              this.selectedCity = sites.city;
              this.timeZoneFilter.country = sites.city.country.name;
              this.getAllTimeZones(this.timeZoneFilter, sites.timeZoneId);
            }
            this.isTemporaryUnknownAddress = sites.tempUnknownAddress && sites.tempUnknownAddress === '1';
            this.isNotAutomaticArchived = sites.notAutomaticArchived && sites.notAutomaticArchived === '1';
            this.attachedFiles = sites.attachedFiles ? sites.attachedFiles : [];

            this.siteForm.patchValue({
              siteCode: sites.siteCode,
              siteName: sites.siteName,
              statusSite: sites.statusSite,
              updateStatusDate: sites.statusDate || null,
              siteOperatorOnSite: sites.siteOperatorOnSite || null,
              siteType: sites.siteType,
              siteFixePhone: sites.siteFixePhone,
              usualName: sites.usualName,
              sifCode: sites.company || null,
              sector: (sites.company && sites.company.zone.sector) || null,
              zone: (sites.company && sites.company.zone) || null,
              company: sites.company,
              segmentations: sites.segmentations,
              backbone: sites.notAutomaticArchived && sites.backbone === 1,
              address1: sites.address1,
              tempUnknownAddress: this.isTemporaryUnknownAddress,
              address2: sites.address2,
              address3: sites.address3,
              longitude: sites.longitude,
              latitude: sites.latitude,
              country: sites.city.country,
              postCode: sites.postCode,
              city: sites.city,
              timeZoneId: sites.timeZoneId || null,
              itManager: sites.itManager || null,
              rsm: sites.rsm || null,
              securityContact: sites.securityContact || null,
              telephonyContact: sites.telephonyContact || null,
              doNotArchiveSite: this.isNotAutomaticArchived,
              comments: sites.comments,
              numberUsers: sites.numberUsers,
              pstnNumber: sites.pstnNumber,
              secondPhoneNo: sites.secondPhoneNo,
              isVideo: sites.isVideo,
              attachedFiles: this.attachedFiles, // sites.attachedFiles,
              application: sites.application
            });
            if (sites.oldSite) {
              this.getOldSifCode(sites.oldSite);
            } else {
              this.siteForm.patchValue({
                oldSiteObj: null
              });
            }

            if (this.isAdmin || this.isRsm) {
              if (this.isTemporaryUnknownAddress) {
                this.siteForm.controls.address1.disable();
              } else {
                this.siteForm.controls.address1.enable();
              }
            }

            // Impossible to change country in edition

            if (sites.city && sites.city.country) {
              this.siteForm.controls.country.disable();
            }
          })
      );
    } else if (this.data && this.data.mode === 'add') {
      this.siteForm.patchValue({
        siteCode: null,
        oldSiteObj: null,
        siteType: null,
        sifCode: null,
        sector: null,
        zone: null,
        company: null,
        segmentation: null,
        country: null,
        city: null,
        timeZoneId: null,
        itManager: null,
        rsm: null,
        securityContact: null,
        telephonyContact: null,
        isVideo: null,
        application: null
      });
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  onSectorSelected(sector: Sector): void {
    if (sector) {
      this.siteForm.get('zone').setValue(null);
      this.siteForm.get('company').setValue(null);
      this.siteForm.get('sifCode').setValue(null);
      const zoneFilter: ZoneFilter = new ZoneFilter();
      zoneFilter.sector = sector;
      this.getAllZones(zoneFilter);
    }
  }

  onZoneSelected(zone: Zone): void {
    if (zone) {
      this.siteForm.patchValue({
        sector: zone.sector,
        company: null
      });
      const companyFilter: CompanyFilter = new CompanyFilter();
      companyFilter.zone = zone;
      this.getAllCompanies(companyFilter);
    }
  }

  onCompanySelected(company: Company): void {
    if (company && company.sifCode) {
      this.siteForm.patchValue({
        sifCode: company,
        sector: company.zone.sector,
        zone: company.zone
      });
    }
  }

  onSifSelected(company: Company): void {
    if (company && company.sifCode) {
      this.siteForm.patchValue({
        sector: company.zone.sector,
        zone: company.zone,
        company
      });
    }
  }

  onCountrySelected(country: Country): void {
    if (country) {
      this.sub$.add(
        this.contactService.getContactByCountry(country.id).subscribe((rsm: Contact) => {
          this.siteForm.patchValue({
            postCode: country.id + '-',
            city: null,
            rsm
          });
        })
      );

      this.rsms = this.getAllRsms();

      const cityFilter: CityFilter = new CityFilter();
      if (country.id) {
        cityFilter.country = country;
        cityFilter.skip = true;
        this.timeZoneFilter.country = country.name;
      }
      this.getAllCities(cityFilter);
      this.getAllTimeZones(this.timeZoneFilter);
    }
  }

  onCitySelected(city: City): void {
    this.selectedCity = null;
    if (city) {
      this.selectedCity = city;
      const postCode = this.siteForm.value.postCode;
      this.siteForm.patchValue({
        postCode: postCode && postCode.includes(city.country.id) ? postCode : city.country.id + '-',
        country: city.country
      });
      this.timeZoneFilter.country = city.country.name;
      this.getAllTimeZones(this.timeZoneFilter);
      if (this.disableSiteSearch) {
        this.searchSiteByCity();
      }
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    if (errorName === 'pattern') {
      return this.siteForm.controls[controlName].hasError(errorName);
    }
    return this.siteForm.controls[controlName].hasError(errorName) && this.siteForm.controls[controlName].touched;
  }

  toggleTempUnknownAddress(event: MatSlideToggleChange): void {
    if (event.checked) {
      this.siteForm.controls.address1.setValue('');
      this.siteForm.controls.address1.disable();
    } else {
      this.siteForm.controls.address1.enable();
    }
    this.isTemporaryUnknownAddress = event.checked;
  }

  toggleAutomaticArchived(event: MatSlideToggleChange): void {
    this.isNotAutomaticArchived = event.checked;
  }

  openSite(data: Site): void {
    const dialogRef = this.dialog.open(SiteDialogComponent, {
      width: '800px',
      disableClose: true,
      data: { site: data.siteCode, mode: 'edit' }
    });
    dialogRef.afterClosed().subscribe();
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  onSubmit(): void {
    if (this.siteForm.valid && !this.isLoading) {
      const formData = new FormData();
      this.isLoading = true;
      const site: Site = Object.assign(this.siteForm.value);
      const oldSiteObj: Site = this.siteForm.get('oldSiteObj').value;
      site.attachedFiles = this.attachedFiles;
      site.backbone = 0;
      site.tempUnknownAddress = '0';
      site.notAutomaticArchived = '0';

      if (oldSiteObj) {
        site.oldSite = oldSiteObj.siteCode;
      }
      if (this.siteForm.get('backbone').value === true) {
        site.backbone = 1;
      }
      if (this.siteForm.get('tempUnknownAddress').value === true) {
        site.tempUnknownAddress = '1';
      }
      if (this.siteForm.get('doNotArchiveSite').value === true) {
        site.notAutomaticArchived = '1';
      }

      this.attachedFiles.forEach(element => {
        if (element.file) {
          formData.append('file', element.file);
        }
      });

      formData.append('siteDTO', new Blob([JSON.stringify(site)], { type: 'application/json' }));

      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.siteService
            .addSite(formData)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(
                this.translateService.instant('common.save.success.message.with.params', { code: res.siteCode }),
                'success'
              );
            })
        );
      } else {
        this.sub$.add(
          this.siteService
            .editSite(formData, site.siteCode)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(
                this.translateService.instant('common.save.success.message.with.params', { code: res.siteCode }),
                'success'
              );
            })
        );
      }
    }
  }

  openCityDialog(): void {
    const country = this.siteForm.get('country').value;
    this.cityDialogData.city.country = country;
    this.cityDialogData.mode = 'add';
    const dialogRef = this.dialog.open(CityDialogComponent, {
      width: '500px',
      data: this.cityDialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        if (result.data) {
          this.siteForm.patchValue({
            country: result.data.country,
            city: result.data,
            postCode: result.data.country.id + '-'
          });
          this.timeZoneFilter.country = result.data.country.name;
          this.getAllTimeZones(this.timeZoneFilter);
        }
      }
    });
  }

  handleFileInput(files: File[]) {
    if (files && files.length > 0) {
      this.fileList = files;
    }
    this.showFileUploadButton = this.fileList && this.fileList.length > 0;
  }

  addFile(): void {
    if (!this.siteForm.get('application').value) {
      this.messageService.show(
        this.translateService.instant('site.dialogbox.tab.description.application.select.message'),
        'error'
      );
      return;
    }
    if (this.attachedFiles) {
      for (let i = 0; i < this.fileList.length; i++) {
        const app: Application = this.siteForm.get('application').value;
        const attachedfile: Attachedfiles = new Attachedfiles();
        attachedfile.file = this.fileList[i];
        attachedfile.filename = this.fileList[i].name;
        attachedfile.filesId = i;
        attachedfile.siteCode = null;
        attachedfile.application = app.name;
        if (!this.containsFile(attachedfile, this.attachedFiles)) {
          this.attachedFiles.push(attachedfile);
        }
      }
      this.attachedFiles = [].concat(this.attachedFiles);
      this.fileList = [];
      this.fileUploadComponent.clearFiles();
      this.showFileUploadButton = false;
      this.siteForm.markAsDirty();
    }
  }

  deleteFile(file: Attachedfiles): void {
    const idx: number = this.attachedFiles.indexOf(file);
    if (this.attachedFiles && -1 !== idx) {
      this.attachedFiles.splice(idx, 1);
      this.attachedFiles = [].concat(this.attachedFiles);
      this.siteForm.markAsDirty();
    }
  }

  downloadFile(attachedFile: Attachedfiles): void {
    if (!attachedFile.filesId) {
      return;
    }
    this.siteService.downloadAttachedFiles(attachedFile.filesId.toString()).subscribe(res => {
      if (res) {
        const blob = new Blob([res]);
        saveAs(blob, attachedFile.filename);
      }
    });
  }

  searchSiteByCity(): void {
    const city: City = this.siteForm.get('city').value;
    this.advanceFilter = new SiteFilter();
    this.advanceFilter.city = city;
    this.getAllSites('siteCode', 'asc', null, this.advanceFilter);
    this.panelFilterSite = true;
    this.disableSiteSearch = true;
    if (this.sort) {
      this.sub$.add(
        this.sort.sortChange.subscribe(() => {
          this.pageIndex = 0;
          this.getAllSites(this.sort.active, this.sort.direction, null, this.advanceFilter);
        })
      );
    }
    if (this.paginator) {
      this.sub$.add(
        this.paginator.page.subscribe(() => {
          this.pageIndex = this.paginator.pageIndex;
          this.pageSize = this.paginator.pageSize;
          this.getAllSites(this.sort.active, this.sort.direction, null, this.advanceFilter);
        })
      );
    }
  }

  resetSites(): void {
    this.panelFilterSite = false;
    this.sites = null;
    this.disableSiteSearch = false;
  }

  addContact(role: string): void {
    this.contactDialogData.role = role;
    this.dialog
      .open(ContactDialogComponent, {
        width: '600px',
        disableClose: true,
        data: this.contactDialogData
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          const contact = new Contact(
            result.id,
            result.name,
            result.firstName,
            result.name + ' ' + result.firstName,
            null,
            null,
            result.email,
            result.title,
            result.fixPhone,
            result.mobilePhone,
            null,
            null
          );
          if (role === 'itManager') {
            this.siteForm.patchValue({
              itManager: contact
            });
          } else if (role === 'rsm') {
            this.siteForm.patchValue({
              rsm: contact
            });
            this.rsms = this.getAllRsms();
          } else if (role === 'securityContact') {
            this.siteForm.patchValue({
              securityContact: contact
            });
          } else if (role === 'telephonyContact') {
            this.siteForm.patchValue({
              telephonyContact: contact
            });
          }
        }
      });
  }

  private getAllRsms(): Observable<Contact[]> {
    const contactFilter: ContactFilter = new ContactFilter();
    const profile: Profile = new Profile();
    const country: Country = this.siteForm.get('country').value;
    profile.name = environment.rsmProfileName;
    contactFilter.profile = profile;
    if (country) {
      contactFilter.countrySupervised = country.id;
    }

    return this.contactService.getAllContacts(0, 200, 'firstName', 'asc', '', contactFilter).pipe(
      switchMap(result => {
        return of(result.content.sort((a, b) => a.fullName.localeCompare(b.fullName)));
      })
    );
  }

  private getAllSites(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.siteService
        .getAllSites(this.pageIndex, this.pageSize, sortField, sortDirection, search, siteFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Site>) => {
          if (page) {
            this.sites = page.content;
            this.totalElements = page.totalElements;
          }
        })
    );
  }

  private getOldSifCode(value: string): void {
    if (value) {
      this.isLoadingOldSite = true;
      this.sub$.add(
        this.siteService
          .getSiteById(value)
          .pipe(finalize(() => (this.isLoadingOldSite = false)))
          .subscribe(result => {
            if (result) {
              this.siteForm.patchValue({
                oldSiteObj: result
              });
            }
          })
      );
    }
  }

  private getAllZones(zoneFilter?: ZoneFilter): void {
    this.isLoading = true;
    this.sub$.add(
      this.zoneService
        .getAllZones('', 0, 100, '', 'name', 'asc', zoneFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Zone>) => {
          if (page) {
            this.zones = page.content;
          }
        })
    );
  }

  private getAllCompanies(companyFilter?: CompanyFilter): void {
    this.isLoading = true;
    companyFilter.skip = true;
    this.sub$.add(
      this.companyService
        .getAllCompanies('', 0, 50, 'name', 'asc', companyFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Company>) => {
          if (page) {
            this.companies = page.content.sort((a, b) => a.companyName.localeCompare(b.companyName));
          }
        })
    );
  }

  private getAllCities(cityFilter?: CityFilter): void {
    this.isLoading = true;
    this.sub$.add(
      this.cityService
        .getAllCities(0, 50, 'name', 'asc', '', cityFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<City>) => {
          if (page) {
            this.cities = page.content.sort((a, b) => a.name.localeCompare(b.name));
          }
        })
    );
  }

  private getAllSegmentations(segmentationFilter: SegmentationFilter): void {
    this.isLoading = true;
    this.sub$.add(
      this.segmentationService
        .getAllSegmentation('', 0, 50, 'name', 'asc', segmentationFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Segmentation>) => {
          if (page) {
            this.segmentations = page.content.sort((a, b) => a.name.localeCompare(b.name));
          }
        })
    );
  }

  private getAllTimeZones(timeZoneFilter: TimeZone, timeZoneId?: number): void {
    this.isLoading = true;
    this.sub$.add(
      this.timeZoneService
        .getAllTimeZones(0, 50, 'timeZone', 'asc', null, timeZoneFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<TimeZone>) => {
          if (page) {
            this.timezones = page.content;
            if (this.siteForm.controls.timeZoneId.value) {
              this.siteForm.controls.timeZoneId.setValidators(
                Validators.compose([Validators.required, TimezoneValidators.valueSelected(this.timezones)])
              );
              this.siteForm.controls.timeZoneId.updateValueAndValidity();
            }
            if (this.siteForm.value.country && this.timezones.length > 0 && (!timeZoneId || timeZoneId === 0)) {
              this.siteForm.patchValue({
                timeZoneId: this.timezones[0].id
              });
            }
          }
        })
    );
  }

  private containsFile(selectedFile: Attachedfiles, list: Attachedfiles[]): boolean {
    list.forEach(element => {
      if (element.filename === selectedFile.filename) {
        return true;
      }
    });
    return false;
  }
}
