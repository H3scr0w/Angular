import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ContactDialogData } from '../../definition/contact/contact-dialog/contact-dialog-data';
import { ContactDialogComponent } from '../../definition/contact/contact-dialog/contact-dialog.component';
import { CityDialogData } from '../../reference/city/city-dialog/city-dialog-data';
import { CityDialogComponent } from '../../reference/city/city-dialog/city-dialog.component';
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
} from '../../shared';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { Application } from '../../shared/models/application';
import { Attachedfiles } from '../../shared/models/attachedfiles.model';
import { Contact, ContactFilter } from '../../shared/models/contact';
import { Profile } from '../../shared/models/profile';
import { Segmentation, SegmentationFilter } from '../../shared/models/segmentation.model';
import { SiteCreationRequest } from '../../shared/models/site-creation-request';
import { ApplicationService } from '../../shared/services/application/application.service';
import { ContactService } from '../../shared/services/contact/contact.service';
import { SegmentationService } from '../../shared/services/segmentation/segmentation.service';
import { SiteCreationRequestService } from '../../shared/services/site-creation-request/site-creation-request.service';
import { TimeZoneService } from '../../shared/services/time-zone/time-zone.service';
import { TimezoneValidators } from '../../shared/validator/timezone-validator';
import { RequestDialogData } from '../request-dialog-data';

@Component({
  selector: 'stgo-request-site-create-dialog',
  templateUrl: './request-site-create-dialog.component.html',
  styleUrls: ['./request-site-create-dialog.component.scss']
})
export class RequestSiteCreateDialogComponent implements OnInit, OnDestroy {
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
  securityContacts: Observable<Contact[]>;
  telephonyContacts: Observable<Contact[]>;
  rsms: Observable<Contact[]>;
  videos: string[] = ['Yes', 'No', 'Yes Partially'];
  applications: Application[];
  isTemporaryUnknownAddress = false;
  isNotAutomaticArchived = false;
  attacedFiles: Attachedfiles[] = [];
  showFileUploadButton = false;
  displayedColumns: string[] = ['fileName', 'application', 'actions'];
  displayedSiteColumns: string[] = ['siteName'];
  panelFilterSite = false;
  disableSiteSearch = false;
  sites: Site[] = [];
  fileList: File[];
  totalElements: number;
  btnSaveText: string;
  inputOldSite: Subject<string> = new Subject<string>();
  inputSiteType: Subject<string> = new Subject<string>();
  inputSifCode: Subject<string> = new Subject<string>();
  inputSector: Subject<string> = new Subject<string>();
  inputZone: Subject<string> = new Subject<string>();
  inputCompany: Subject<string> = new Subject<string>();
  inputCountry: Subject<string> = new Subject<string>();
  inputSegmentation: Subject<string> = new Subject<string>();
  inputCity: Subject<string> = new Subject<string>();
  inputTimeZone: Subject<string> = new Subject<string>();
  inputITManager: Subject<string> = new Subject<string>();
  inputSecurityContact: Subject<string> = new Subject<string>();
  inputTelephonyContact: Subject<string> = new Subject<string>();
  inputRsm: Subject<string> = new Subject<string>();

  isViewOnly = false;
  isModficationRequest = false;
  isNewCity = false;
  isNewItManager = false;
  isNewSecurityContact = false;
  isNewTelephonyContact = false;

  siteForm = this.formBuilder.group({
    id: [''],
    siteCode: [''],
    siteName: [''],
    oldSite: [''],
    oldSelectedSite: [''],
    statusSite: [''],
    updateStatusDate: [''],
    siteType: [''],
    siteFixePhone: [''],
    usualName: [''],
    sifCode: [''],
    sector: [''],
    zone: [''],
    company: ['', Validators.required],
    segmentations: ['', Validators.required],
    backbone: [''],
    address1: ['', Validators.required],
    tempUnknownAddress: [''],
    address2: [''],
    address3: [''],
    longitude: [''],
    latitude: [''],
    country: [null, Validators.required],
    postCode: [null, Validators.required],
    city: [null, Validators.required],
    timeZoneId: [null, Validators.required],
    itManager: [null, Validators.required],
    securityContact: [null],
    telephonyContact: [null],
    rsm: [null],
    doNotArchiveSite: [''],
    comments: [''],
    numberUsers: ['', Validators.required],
    pstnNumber: [''],
    secondPhoneNo: [''],
    isVideo: [null, Validators.required],
    application: [null]
  });

  private sub$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RequestSiteCreateDialogComponent>,
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
    private siteRequestCretionService: SiteCreationRequestService,
    @Inject(MAT_DIALOG_DATA) public data: RequestDialogData,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.data && this.data.mode.trim() === 'validate') {
      this.isViewOnly = this.data.viewOnly;
      this.btnSaveText = 'request.validate';
      if (this.data.id && this.data.siteCode && this.data.action === 'M') {
        this.getSiteForValidateModificationRequest();
      } else if (this.data.id) {
        this.getSiteForValidateCreationRequest();
      }
    } else if (this.data && this.data.mode === 'creation') {
      this.btnSaveText = 'request.Send';
      this.siteForm.patchValue({
        siteCode: null,
        oldSelectedSite: null,
        siteType: null,
        sifCode: null,
        sector: null,
        zone: null,
        company: null,
        segmentations: null,
        country: null,
        city: null,
        timeZoneId: null,
        itManager: null,
        securityContact: null,
        telephonyContact: null,
        isVideo: null,
        application: null
      });
      this.initFormControls();
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  onSectorSelected(sector: Sector): void {
    if (sector) {
      this.siteForm.get('zone').setValue(null);
      this.siteForm.get('company').setValue(null);
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

  onSegmentationSelected(segmentation: Segmentation): void {
    if (segmentation) {
      this.siteForm.patchValue({
        segmentation
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
      this.isNewCity = false;
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

  onOldSiteCodeSelected(site: Site): void {
    let selectedSiteCode = null;
    if (site) {
      selectedSiteCode = site.siteCode;
    }
    this.siteForm.patchValue({
      oldSite: selectedSiteCode
    });
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

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  onSubmit(): void {
    if (this.siteForm.valid && !this.isLoading) {
      this.isLoading = true;
      const site: SiteCreationRequest = Object.assign(this.siteForm.value);
      site.backbone = 0;
      site.tempUnknownAddress = '0';
      site.notAutomaticArchived = '0';
      if (this.siteForm.get('backbone').value === true) {
        site.backbone = 1;
      }
      if (this.siteForm.get('tempUnknownAddress').value === true) {
        site.tempUnknownAddress = '1';
      }
      if (this.siteForm.get('doNotArchiveSite').value === true) {
        site.notAutomaticArchived = '1';
      }
      site.oldSelectedSite = null;
      site.attachedFiles = this.attacedFiles;
      if (this.data.id && this.data.siteCode && this.data.action === 'M') {
        this.siteModificationRequestAndValidation(site);
      } else {
        this.siteCreationRequestAndValidation(site);
      }
    }
  }

  openCityDialog(city: City): void {
    if (this.data && this.data.mode === 'creation') {
      this.cityDialogData.isCityRequested = true;
    } else {
      this.cityDialogData.isCityRequested = false;
      this.cityDialogData.city = city;
    }

    const dialogRef = this.dialog.open(CityDialogComponent, {
      width: '500px',
      data: this.cityDialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        if (result.data) {
          const newCity: City = result.data;
          if (!newCity.id) {
            this.isNewCity = true;
          }

          this.siteForm.patchValue({
            country: newCity.country,
            city: newCity,
            postCode: newCity.country.id + '-'
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
    if (this.attacedFiles) {
      for (let i = 0; i < this.fileList.length; i++) {
        const app: Application = this.siteForm.get('application').value;
        const attachedfile: Attachedfiles = new Attachedfiles();
        attachedfile.file = this.fileList[i];
        attachedfile.filename = this.fileList[i].name;
        attachedfile.filesId = i;
        attachedfile.siteCode = null;
        attachedfile.application = app.name;
        if (!this.containsFile(attachedfile, this.attacedFiles)) {
          this.attacedFiles.push(attachedfile);
        }
      }
      this.attacedFiles = [].concat(this.attacedFiles);
      this.fileList = [];
      this.fileUploadComponent.clearFiles();
      this.showFileUploadButton = false;
    }
  }

  deleteFile(file: Attachedfiles): void {
    const ix: number = this.attacedFiles.indexOf(file);
    if (this.attacedFiles && -1 !== ix) {
      this.attacedFiles.splice(ix, 1);
      this.attacedFiles = [].concat(this.attacedFiles);
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

  addContact(role: string, requestdContact?: Contact): void {
    if (!requestdContact) {
      requestdContact = new Contact();
    }

    if (this.data && this.data.mode === 'creation') {
      this.contactDialogData.contact = requestdContact;
      this.contactDialogData.isContactRequested = true;
    } else {
      if (
        (this.isNewItManager && role === 'itManager') ||
        (this.isNewSecurityContact && role === 'securityContact') ||
        (this.isNewTelephonyContact && role === 'telephonyContact')
      ) {
        this.contactDialogData.contact = requestdContact;
        this.contactDialogData.isContactAlreadyRequested = true;
        this.contactDialogData.isContactRequested = false;
      } else {
        this.contactDialogData.contact = null;
        this.contactDialogData.isContactRequested = false;
      }
    }

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
            result.countries,
            result.countrySupervised,
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
            this.isNewItManager = false;
          } else if (role === 'securityContact') {
            this.siteForm.patchValue({
              securityContact: contact
            });
            this.isNewSecurityContact = false;
          } else if (role === 'telephonyContact') {
            this.siteForm.patchValue({
              telephonyContact: contact
            });
            this.isNewTelephonyContact = false;
          }
        }
      });
  }

  public onChangeItManager() {
    this.isNewItManager = false;
  }

  public onChangeTelephonyContact() {
    this.isNewTelephonyContact = false;
  }

  public onChangeSecurityContact() {
    this.isNewSecurityContact = false;
  }

  private siteModificationRequestAndValidation(site: SiteCreationRequest) {
    const formData = new FormData();
    formData.append('siteDTO', new Blob([JSON.stringify(site)], { type: 'application/json' }));
    this.sub$.add(
      this.siteService
        .editSite(formData, site.siteCode)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          this.dialogRef.close('validated');
        })
    );
  }

  private siteCreationRequestAndValidation(site: SiteCreationRequest) {
    const formData = new FormData();
    this.attacedFiles.forEach(element => {
      if (element.file) {
        formData.append('file', element.file);
      }
    });
    formData.append('siteCreationRequestDTO', new Blob([JSON.stringify(site)], { type: 'application/json' }));

    if (this.data && this.data.mode === 'creation') {
      this.sub$.add(
        this.siteRequestCretionService
          .createSiteCreationRequest(formData)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          })
      );
    } else {
      this.sub$.add(
        this.siteRequestCretionService
          .validateSiteCreationRequest(formData, String(site.id))
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          })
      );
    }
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
                oldSite: result.siteCode,
                oldSelectedSite: result
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

  private getAllCities(cityFilter?: CityFilter): void {
    this.isLoading = true;
    cityFilter.skip = true;
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
            } else if (this.siteForm.value.country && this.timezones.length > 0 && (!timeZoneId || timeZoneId === 0)) {
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

  private getSiteForValidateCreationRequest(): void {
    this.sub$.add(
      this.siteRequestCretionService.getSiteCreationRequestById(this.data.id).subscribe(sites => {
        if (sites.city) {
          this.selectedCity = sites.city;
          this.timeZoneFilter.country = sites.city.country.name;
          this.getAllTimeZones(this.timeZoneFilter, sites.timeZoneId);
        }

        this.isTemporaryUnknownAddress = sites.tempUnknownAddress && sites.tempUnknownAddress === '1';
        this.isNotAutomaticArchived = sites.notAutomaticArchived && sites.notAutomaticArchived === '1';
        this.attacedFiles = sites.attachedFiles ? sites.attachedFiles : [];
        this.siteForm.patchValue({
          id: sites.id,
          siteCode: sites.siteCode,
          siteName: sites.siteName,
          statusSite: sites.statusSite,
          updateStatusDate: sites.statusDate || null,
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
          securityContact: sites.securityContact || null,
          telephonyContact: sites.telephonyContact || null,
          iptServiceManager: null,
          rsm: null,
          doNotArchiveSite: this.isNotAutomaticArchived,
          comments: sites.comments,
          numberUsers: sites.numberUsers,
          pstnNumber: sites.pstnNumber,
          secondPhoneNo: sites.secondPhoneNo,
          isVideo: sites.isVideo || null,
          attachedFiles: this.attacedFiles
        });

        this.initFormControls();

        if (sites.itManager && sites.itManager.id === undefined) {
          this.isNewItManager = true;
          const contactFilter = new ContactFilter();
          contactFilter.email = sites.itManager.email;
          this.contactService.getAllContacts(0, 20, '', '', null, contactFilter).subscribe(page => {
            if (page.totalElements !== 0) {
              this.isNewItManager = false;
              sites.itManager = page.content[0];
              this.siteForm.patchValue({
                itManager: sites.itManager
              });
            }
            const itManagerControl = this.siteForm.controls.itManager;
            itManagerControl.setValidators(Validators.compose([Validators.required]));
            itManagerControl.updateValueAndValidity();
          });
        }

        if (sites.securityContact && sites.securityContact.id === undefined) {
          this.isNewSecurityContact = true;
          const contactFilter = new ContactFilter();
          contactFilter.email = sites.securityContact.email;
          this.contactService.getAllContacts(0, 20, '', '', null, contactFilter).subscribe(page => {
            if (page.totalElements !== 0) {
              this.isNewSecurityContact = false;
              sites.securityContact = page.content[0];
              this.siteForm.patchValue({
                securityContact: sites.securityContact
              });
            }
            const securityContactControl = this.siteForm.controls.securityContact;
            securityContactControl.setValidators(Validators.compose([Validators.required]));
            securityContactControl.updateValueAndValidity();
          });
        }

        if (sites.telephonyContact && sites.telephonyContact.id === undefined) {
          this.isNewTelephonyContact = true;
          const contactFilter = new ContactFilter();
          contactFilter.email = sites.telephonyContact.email;
          this.contactService.getAllContacts(0, 20, '', '', null, contactFilter).subscribe(page => {
            if (page.totalElements !== 0) {
              this.isNewTelephonyContact = false;
              sites.telephonyContact = page.content[0];
              this.siteForm.patchValue({
                telephonyContact: sites.telephonyContact
              });
            }
            const telephonyContactControl = this.siteForm.controls.telephonyContact;
            telephonyContactControl.setValidators(Validators.compose([Validators.required]));
            telephonyContactControl.updateValueAndValidity();
          });
        }

        if (sites.city && sites.city.id === undefined) {
          this.isNewCity = true;
          const cityControl = this.siteForm.controls.city;
          cityControl.setValidators(Validators.compose([Validators.required]));
          cityControl.updateValueAndValidity();
        }

        if (sites.oldSite) {
          this.getOldSifCode(sites.oldSite);
        } else {
          this.siteForm.patchValue({
            oldSite: null,
            oldSelectedSite: null
          });
        }
        if (this.isTemporaryUnknownAddress) {
          this.siteForm.controls.address1.disable();
        } else {
          this.siteForm.controls.address1.enable();
        }
      })
    );
  }

  private getSiteForValidateModificationRequest(): void {
    this.isLoadingSite = true;
    this.sub$.add(
      this.siteService
        .getSiteById(this.data.siteCode)
        .pipe(finalize(() => (this.isLoadingSite = false)))
        .subscribe(sites => {
          if (sites.city) {
            this.selectedCity = sites.city;
            this.timeZoneFilter.country = sites.city.country.name;
            this.getAllTimeZones(this.timeZoneFilter);
          }
          this.isTemporaryUnknownAddress = sites.tempUnknownAddress && sites.tempUnknownAddress === '1';
          this.isNotAutomaticArchived = sites.notAutomaticArchived && sites.notAutomaticArchived === '1';
          this.attacedFiles = sites.attachedFiles ? sites.attachedFiles : [];
          this.siteForm.patchValue({
            siteCode: sites.siteCode,
            siteName: sites.siteName,
            statusSite: sites.statusSite,
            updateStatusDate: sites.statusDate || null,
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
            securityContact: sites.securityContact || null,
            telephonyContact: sites.telephonyContact || null,
            iptServiceManager: sites.iptServiceManager || null,
            rsm: sites.rsm || null,
            doNotArchiveSite: this.isNotAutomaticArchived,
            comments: sites.comments,
            numberUsers: sites.numberUsers,
            pstnNumber: sites.pstnNumber,
            secondPhoneNo: sites.secondPhoneNo,
            isVideo: sites.isVideo,
            attachedFiles: this.attacedFiles
          });
          if (sites.oldSite) {
            this.getOldSifCode(sites.oldSite);
          } else {
            this.siteForm.patchValue({
              oldSite: null
            });
          }
          if (this.isTemporaryUnknownAddress) {
            this.siteForm.controls.address1.disable();
          } else {
            this.siteForm.controls.address1.enable();
          }
          this.siteForm.updateValueAndValidity();
          this.initFormControls();
        })
    );
  }

  private initFormControls(): void {
    this.oldSites = this.inputOldSite.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.siteService.getAllSites(0, 50, '', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content);
          })
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
            return of(result.content);
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
            return of(result.content);
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
      const cityFilter: CityFilter = new CityFilter();
      const selectedCountry: Country = this.siteForm.get('country').value;
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
        return this.contactService.getAllContacts(0, 50, '', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.fullName.localeCompare(b.fullName)));
          })
        );
      })
    );

    this.securityContacts = this.inputSecurityContact.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.contactService.getAllContacts(0, 50, 'firstName', 'asc', value).pipe(
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
        return this.contactService.getAllContacts(0, 50, 'firstName', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.fullName.localeCompare(b.fullName)));
          })
        );
      })
    );

    this.applications = this.applicationService.getAllApplications();

    if (this.data && this.data.siteCode && this.data.action === 'M' && this.data.id) {
      this.isModficationRequest = true;
      this.rsms = this.inputRsm.pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((value: string) => {
          return this.getAllRsms();
        })
      );
    }
  }
}
