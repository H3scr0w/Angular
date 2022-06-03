import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { Cms } from '../../../../shared/models/cms.model';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { DocrootCore } from '../../../../shared/models/docrootcore.model';
import { DocrootEnvironmentDetail } from '../../../../shared/models/docrootenvironmentdetail.model';
import { CmsService } from '../../../../shared/services/cms.service';
import { DocrootService } from '../../../../shared/services/docroot.service';
import { DrupalDocrootCoreService } from '../../../../shared/services/drupaldocrootcore.service';

@Component({
  selector: 'stgo-edit-docrootenv-dialog',
  templateUrl: './edit-docrootenv-dialog.component.html',
  styleUrls: ['./edit-docrootenv-dialog.component.css']
})
export class EditDocrootenvDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;
  cmsList$: Observable<Cms[]>;
  drupalDocroots$: Observable<DocrootCore[]>;
  cmsSelected: boolean;
  drupalSelected: boolean;
  docrootEnvironmentDetail: DocrootEnvironmentDetail = new DocrootEnvironmentDetail();

  private initDocrootEnvSubscription: Subscription;
  private docrootEnvSubscription: Subscription;

  constructor(
    private docrootService: DocrootService,
    private cmsService: CmsService,
    private drupalDocrootService: DrupalDocrootCoreService,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<EditDocrootenvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.cmsSelected = false;
    this.drupalSelected = false;

    this.formGroup = new FormGroup({
      docroot: new FormControl(this.data.docrootCode, [Validators.required]),
      environment: new FormControl(this.data.environmentCode, [Validators.required]),
      cms: new FormControl({ code: this.docrootEnvironmentDetail.cmsCode }, [Validators.required]),
      drupal: new FormControl({ code: this.docrootEnvironmentDetail.drupalDocrootCoreCode }, [Validators.required]),
      drupalVersion: new FormControl(this.docrootEnvironmentDetail.drupalDocrootCoreVersion, [Validators.required]),
      cmsVersion: new FormControl(this.docrootEnvironmentDetail.cmsVersion, [Validators.required]),
      providerInternalId: new FormControl(this.docrootEnvironmentDetail.providerInternalId),
      acquiaEnvironmentId: new FormControl(this.docrootEnvironmentDetail.acquiaEnvironmentId),
      canAutoDeploy: new FormControl(this.docrootEnvironmentDetail.canAutoDeploy)
    });

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

  ngAfterViewInit(): void {
    this.initDocrootEnvSubscription = this.docrootService
      .getDocrootEnv(this.data.docrootCode, this.data.environmentCode)
      .subscribe((docrootEnv: DocrootEnvironmentDetail) => {
        this.docrootEnvironmentDetail = docrootEnv;
        this.formGroup.controls.cms.setValue({ code: this.docrootEnvironmentDetail.cmsCode });
        this.formGroup.controls.cmsVersion.setValue(this.docrootEnvironmentDetail.cmsVersion);
        this.formGroup.controls.drupal.setValue({ code: this.docrootEnvironmentDetail.drupalDocrootCoreCode });
        this.formGroup.controls.drupalVersion.setValue(this.docrootEnvironmentDetail.drupalDocrootCoreVersion);
        this.formGroup.controls.providerInternalId.setValue(this.docrootEnvironmentDetail.providerInternalId);
        this.formGroup.controls.acquiaEnvironmentId.setValue(this.docrootEnvironmentDetail.acquiaEnvironmentId);
        this.formGroup.controls.canAutoDeploy.setValue(this.docrootEnvironmentDetail.canAutoDeploy);
        this.cmsSelected = true;
        this.drupalSelected = true;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.initDocrootEnvSubscription) {
      this.initDocrootEnvSubscription.unsubscribe();
    }
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
      .createOrUpdateEnv(this.data.environmentCode, this.data.docrootCode, this.docrootEnvironmentDetail)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close());
  }

  selectedObject(type: number, project: Cms | DocrootCore): void {
    switch (type) {
      case 1: {
        this.docrootEnvironmentDetail.cmsCode = project.code;
        this.cmsSelected = true;
        break;
      }
      case 2: {
        this.docrootEnvironmentDetail.drupalDocrootCoreCode = project.code;
        this.drupalSelected = true;
        break;
      }
      default: {
        break;
      }
    }
  }

  openedCms(): void {
    this.cmsSelected = false;
  }

  openedDrupal(): void {
    this.drupalSelected = false;
  }

  displayFn(project: Cms | DocrootCore): string {
    return project.code;
  }

  canActivateButton(): boolean {
    return this.cmsSelected && this.drupalSelected;
  }
}
