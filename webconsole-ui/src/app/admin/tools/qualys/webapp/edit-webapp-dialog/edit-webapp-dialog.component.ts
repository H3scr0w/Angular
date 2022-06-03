import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { DialogData } from '../../../../../shared/models/dialog-data.model';
import { Domain } from '../../../../../shared/models/domain.model';
import { Page } from '../../../../../shared/models/page.model';
import { OptionProfile } from '../../../../../shared/models/tools/qualys/optionprofile.model';
import { RobotType } from '../../../../../shared/models/tools/qualys/robot-type.model';
import { ScannerAppliance } from '../../../../../shared/models/tools/qualys/scanner-appliance.model';
import { ScannerType } from '../../../../../shared/models/tools/qualys/scanner-type.model';
import { AuthRecordsWrapper } from '../../../../../shared/models/tools/qualys/util/authrecord-wrapper.model';
import { SetWrapper } from '../../../../../shared/models/tools/qualys/util/set-wrapper.model';
import { WebApp } from '../../../../../shared/models/tools/qualys/webapp.model';
import { WebAppAuthRecord } from '../../../../../shared/models/tools/qualys/webappauthrecord.model';
import { Website } from '../../../../../shared/models/website.model';
import { DomainService } from '../../../../../shared/services/domain.service';
import { OptionProfileService } from '../../../../../shared/services/tools/qualys/optionprofile.service';
import { WebappService } from '../../../../../shared/services/tools/qualys/webapp.service';
import { WebappauthrecordService } from '../../../../../shared/services/tools/qualys/webappauthrecord.service';
import { WebsiteService } from '../../../../../shared/services/website.service';

@Component({
  selector: 'stgo-edit-webapp-dialog',
  templateUrl: './edit-webapp-dialog.component.html',
  styleUrls: ['./edit-webapp-dialog.component.css']
})
export class EditWebappDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;

  scannerTypes = [ScannerType.EXTERNAL, ScannerType.INTERNAL];
  robotTypes = [RobotType.ADD_PATHS, RobotType.BLACKLIST, RobotType.IGNORE];

  websiteSelected: boolean;
  domainSelected: boolean;
  authRecordSelected: boolean;
  profileSelected: boolean;

  searchWebsite = false;
  searchDomain = false;
  searchAuthRecord = false;
  searchProfile = false;

  website$: Observable<Website[]>;
  domain$: Observable<Domain[]>;
  webAppauthRecord$: Observable<WebAppAuthRecord[]>;
  profile$: Observable<OptionProfile[]>;

  private webAppSubscription: Subscription;

  constructor(
    private webAppService: WebappService,
    private websiteService: WebsiteService,
    private domainService: DomainService,
    private webAppAuthRecordService: WebappauthrecordService,
    private optionProfileService: OptionProfileService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<EditWebappDialogComponent>
  ) {}

  ngOnInit(): void {
    this.websiteSelected = false;
    this.domainSelected = false;
    this.authRecordSelected = false;
    this.profileSelected = false;

    if (this.data.webApp) {
      this.websiteSelected = true;

      this.formGroup = new FormGroup({
        website: new FormControl({ name: this.data.webApp.name }, [Validators.required]),
        domain: new FormControl({ code: this.data.webApp.url }, [Validators.required])
      });
    } else {
      this.formGroup = new FormGroup({
        website: new FormControl('', [Validators.required]),
        domain: new FormControl('', [Validators.required]),
        webAppauthRecord: new FormControl('', [Validators.required]),
        profile: new FormControl('', [Validators.required]),
        scannerType: new FormControl(),
        robotType: new FormControl(),
        useSitemap: new FormControl()
      });

      this.webAppauthRecord$ = this.formGroup.controls.webAppauthRecord.valueChanges.pipe(
        filter((query) => query.length >= 1),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query: string) => {
          this.searchAuthRecord = true;
          return this.webAppAuthRecordService.searchWebAppAuthRecordsByName(query).pipe(
            finalize(() => (this.searchAuthRecord = false)),
            map((page: Page<WebAppAuthRecord>) => page.content)
          );
        })
      );

      this.profile$ = this.formGroup.controls.profile.valueChanges.pipe(
        filter((query) => query.length >= 1),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query: string) => {
          this.searchProfile = true;
          return this.optionProfileService.searchOptionProfilesByName(query).pipe(
            finalize(() => (this.searchProfile = false)),
            map((page: Page<OptionProfile>) => page.content)
          );
        })
      );
    }

    this.website$ = this.formGroup.controls.website.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.searchWebsite = true;
        return this.websiteService.getWebsitesByNameAndQualysEnable(query, true).pipe(
          finalize(() => (this.searchWebsite = false)),
          map((page: Page<Website>) => page.content)
        );
      })
    );

    this.domain$ = this.formGroup.controls.domain.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.searchDomain = true;
        return this.domainService.getAllDomainsByNameAndQualysEnable(query, true).pipe(
          finalize(() => (this.searchDomain = false)),
          map((page: Page<Domain>) => page.content)
        );
      })
    );
  }

  ngOnDestroy(): void {
    if (this.webAppSubscription) {
      this.webAppSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;

    if (this.data.webApp) {
      const domain: Domain = this.formGroup.get('domain')!.value;
      this.data.webApp.url = domain.code;
      this.webAppSubscription = this.webAppService
        .updateWebApp(this.data.webApp.id, this.data.webApp)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe(() => this.dialogRef.close(true));
    } else {
      const website: Website = this.formGroup.get('website')!.value;
      const domain: Domain = this.formGroup.get('domain')!.value;
      const webAppAuthRecord: WebAppAuthRecord = this.formGroup.get('webAppauthRecord')!.value;
      const profile: OptionProfile = this.formGroup.get('profile')!.value;

      const webApp: WebApp = new WebApp();

      webApp.name = website.code;
      webApp.url = domain.code;

      webApp.authRecords = new AuthRecordsWrapper();
      webApp.authRecords.set = new SetWrapper<WebAppAuthRecord>();
      webApp.authRecords.set.WebAppAuthRecord = [webAppAuthRecord];

      webApp.defaultProfile = profile;

      const scannerType: ScannerType = this.formGroup.get('scannerType')!.value;
      if (scannerType) {
        webApp.defaultScanner = new ScannerAppliance();
        webApp.defaultScanner.type = scannerType;
      }

      const roboType: RobotType = this.formGroup.get('robotType')!.value;

      if (roboType) {
        webApp.useRobots = roboType;
      }

      webApp.useSitemap = this.formGroup.get('useSitemap')!.value;

      this.webAppSubscription = this.webAppService
        .createWebApp(webApp)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe(() => this.dialogRef.close(true));
    }
  }

  canActivateButton(): boolean {
    if (this.data.webApp) {
      return this.websiteSelected && this.domainSelected;
    } else {
      return this.websiteSelected && this.domainSelected && this.authRecordSelected && this.profileSelected;
    }
  }

  selectInput(input: string, action: boolean): void {
    switch (input) {
      case 'website':
        this.websiteSelected = action;
        break;
      case 'domain':
        this.domainSelected = action;
        break;
      case 'authRecord':
        this.authRecordSelected = action;
        break;
      case 'profile':
        this.profileSelected = action;
        break;
      default:
        break;
    }
  }

  displayFn = (input: Website | WebAppAuthRecord | OptionProfile) => {
    if (input) {
      return input.name;
    }
    return '';
  }

  displayDomain(input: Domain): string {
    if (input) {
      return input.code;
    }
    return '';
  }
}
