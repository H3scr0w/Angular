import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { Page } from '../../../../../shared/models/page.model';
import { OptionProfile } from '../../../../../shared/models/tools/qualys/optionprofile.model';
import { WasScanMode } from '../../../../../shared/models/tools/qualys/wascan-mode.model';
import { WasScanTarget } from '../../../../../shared/models/tools/qualys/wascan-target.model';
import { WasScanType } from '../../../../../shared/models/tools/qualys/wascan-type.model';
import { WasScan } from '../../../../../shared/models/tools/qualys/wasscan.model';
import { WebApp } from '../../../../../shared/models/tools/qualys/webapp.model';
import { OptionProfileService } from '../../../../../shared/services/tools/qualys/optionprofile.service';
import { WasscanService } from '../../../../../shared/services/tools/qualys/wasscan.service';
import { WebappService } from '../../../../../shared/services/tools/qualys/webapp.service';

@Component({
  selector: 'stgo-launch-scan-dialog',
  templateUrl: './launch-scan-dialog.component.html',
  styleUrls: ['./launch-scan-dialog.component.css']
})
export class LaunchScanDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;

  types = [WasScanType.DISCOVERY, WasScanType.VULNERABILITY];
  modes = [WasScanMode.API, WasScanMode.ONDEMAND, WasScanMode.SCHEDULED];

  webAppSelected: boolean;
  profileSelected: boolean;

  searchWebApp = false;
  searchProfile = false;

  webapp$: Observable<WebApp[]>;
  profile$: Observable<OptionProfile[]>;

  private wasScanSubscription: Subscription;

  constructor(
    private wasScanService: WasscanService,
    private webAppService: WebappService,
    private optionProfileService: OptionProfileService,
    public dialogRef: MatDialogRef<LaunchScanDialogComponent>
  ) {}

  ngOnInit(): void {
    this.webAppSelected = false;
    this.profileSelected = false;

    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      webapp: new FormControl('', [Validators.required]),
      profile: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      mode: new FormControl()
    });

    this.webapp$ = this.formGroup.controls.webapp.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.searchWebApp = true;
        return this.webAppService.searchWebAppsByName(query).pipe(
          finalize(() => (this.searchWebApp = false)),
          map((page: Page<WebApp>) => page.content)
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

  ngOnDestroy(): void {
    if (this.wasScanSubscription) {
      this.wasScanSubscription.unsubscribe();
    }
  }
  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;

    const webApp: WebApp = this.formGroup.get('webapp')!.value;
    const profile: OptionProfile = this.formGroup.get('profile')!.value;

    const scan: WasScan = new WasScan();
    scan.name = this.formGroup.get('name')!.value;

    scan.target = new WasScanTarget();
    scan.target.webApp = new WebApp();
    scan.target.webApp.id = webApp.id;

    scan.profile = new OptionProfile();
    scan.profile.id = profile.id;

    scan.type = this.formGroup.get('type')!.value;
    scan.mode = this.formGroup.get('mode')!.value;

    this.wasScanSubscription = this.wasScanService
      .launchWasScan(scan)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  canActivateButton(): boolean {
    return this.webAppSelected && this.profileSelected;
  }

  selectInput(input: string, action: boolean): void {
    switch (input) {
      case 'webapp':
        this.webAppSelected = action;
        break;
      case 'profile':
        this.profileSelected = action;
        break;
      default:
        break;
    }
  }

  displayFn = (input: WebApp | OptionProfile) => {
    if (input) {
      return input.name;
    }
    return '';
  }
}
