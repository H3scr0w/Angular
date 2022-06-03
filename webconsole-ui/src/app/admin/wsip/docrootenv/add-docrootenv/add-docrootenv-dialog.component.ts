import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { Cms } from '../../../../shared/models/cms.model';
import { Docroot } from '../../../../shared/models/docroot.model';
import { DocrootCore } from '../../../../shared/models/docrootcore.model';
import { DocrootEnvironmentDetail } from '../../../../shared/models/docrootenvironmentdetail.model';
import { Environment } from '../../../../shared/models/environment.model';
import { CmsService } from '../../../../shared/services/cms.service';
import { DocrootService } from '../../../../shared/services/docroot.service';
import { DrupalDocrootCoreService } from '../../../../shared/services/drupaldocrootcore.service';
import { EnvironmentService } from '../../../../shared/services/environment.service';

@Component({
  selector: 'stgo-add-docrootenv-dialog',
  templateUrl: './add-docrootenv-dialog.component.html',
  styleUrls: ['./add-docrootenv-dialog.component.css']
})
export class AddDocrootenvDialogComponent implements OnDestroy, OnInit {
  formGroup: FormGroup;
  saving = false;
  docroots$: Observable<Docroot[]>;
  environments$: Observable<Environment[]>;
  cmsList$: Observable<Cms[]>;
  drupalDocroots$: Observable<DocrootCore[]>;
  docrootSelected: boolean;
  environmentSelected: boolean;
  cmsSelected: boolean;
  drupalSelected: boolean;
  docrootEnvironmentDetail: DocrootEnvironmentDetail = new DocrootEnvironmentDetail();
  docrootCode: string;
  envCode: string;
  private docrootEnvSubscription: ISubscription;

  constructor(
    private docrootService: DocrootService,
    private environmentService: EnvironmentService,
    private cmsService: CmsService,
    private drupalDocrootService: DrupalDocrootCoreService,
    public dialogRef: MatDialogRef<AddDocrootenvDialogComponent>
  ) {}

  ngOnInit(): void {
    this.docrootSelected = false;
    this.environmentSelected = false;
    this.cmsSelected = false;
    this.drupalSelected = false;
    this.formGroup = new FormGroup({
      docroot: new FormControl('', [Validators.required]),
      environment: new FormControl('', [Validators.required]),
      cms: new FormControl('', [Validators.required]),
      drupal: new FormControl('', [Validators.required]),
      drupalVersion: new FormControl('', [Validators.required]),
      cmsVersion: new FormControl('', [Validators.required]),
      providerInternalId: new FormControl(''),
      acquiaEnvironmentId: new FormControl(''),
      canAutoDeploy: new FormControl(false)
    });

    this.docroots$ = this.formGroup.controls.docroot.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.docrootService.getAllDocrootsByName(query).pipe(map((page) => page.content));
      })
    );

    this.environments$ = this.formGroup.controls.environment.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.environmentService.getAllEnvironmentsByName(query).pipe(map((page) => page.content));
      })
    );

    this.cmsList$ = this.formGroup.controls.cms.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.cmsService.getAllCmsByName(query).pipe(map((page) => page.content));
      })
    );

    this.drupalDocroots$ = this.formGroup.controls.drupal.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.drupalDocrootService.getDrupalDocrootCoresByName(query).pipe(map((page) => page.content));
      })
    );
  }

  ngOnDestroy(): void {
    if (this.docrootEnvSubscription) {
      this.docrootEnvSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    this.docrootEnvironmentDetail.cmsVersion = this.formGroup.get('cmsVersion')!.value;
    this.docrootEnvironmentDetail.drupalDocrootCoreVersion = this.formGroup.get('drupalVersion')!.value;
    this.docrootEnvironmentDetail.canAutoDeploy = this.formGroup.get('canAutoDeploy')!.value;
    this.docrootEnvironmentDetail.providerInternalId = this.formGroup.get('providerInternalId')!.value;
    this.docrootEnvironmentDetail.acquiaEnvironmentId = this.formGroup.get('acquiaEnvironmentId')!.value;
    this.docrootEnvSubscription = this.docrootService
      .createOrUpdateEnv(this.envCode, this.docrootCode, this.docrootEnvironmentDetail)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close());
  }

  selectedObject(type: number, project: Docroot | Environment | Cms | DocrootCore): void {
    switch (type) {
      case 1: {
        this.docrootCode = project.code;
        this.docrootSelected = true;
        break;
      }
      case 2: {
        this.envCode = project.code;
        this.environmentSelected = true;
        break;
      }
      case 3: {
        this.docrootEnvironmentDetail.cmsCode = project.code;
        this.cmsSelected = true;
        break;
      }
      case 4: {
        this.docrootEnvironmentDetail.drupalDocrootCoreCode = project.code;
        this.drupalSelected = true;
        break;
      }
      default: {
        break;
      }
    }
  }

  openedDocroot(): void {
    this.docrootSelected = false;
  }

  openedEnv(): void {
    this.environmentSelected = false;
  }

  openedCms(): void {
    this.cmsSelected = false;
  }

  openedDrupal(): void {
    this.drupalSelected = false;
  }

  displayFn(project: Docroot | Environment | Cms | DocrootCore): string {
    return project.name;
  }

  canActivateButton(): boolean {
    return this.docrootSelected && this.environmentSelected && this.cmsSelected && this.drupalSelected;
  }
}
