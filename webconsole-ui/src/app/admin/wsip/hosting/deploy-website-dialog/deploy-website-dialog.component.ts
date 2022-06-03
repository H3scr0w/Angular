import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { DialogData } from 'src/app/shared/models/dialog-data.model';
import { Docroot } from 'src/app/shared/models/docroot.model';
import { Environment } from 'src/app/shared/models/environment.model';
import { WebsiteDeployed } from 'src/app/shared/models/website-deployed.model';
import { DocrootService } from 'src/app/shared/services/docroot.service';
import { EnvironmentService } from 'src/app/shared/services/environment.service';

@Component({
  selector: 'stgo-deploy-website-dialog',
  templateUrl: './deploy-website-dialog.component.html',
  styleUrls: ['./deploy-website-dialog.component.scss']
})
export class DeployWebsiteDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;
  docroots$: Observable<Docroot[]>;
  environments$: Observable<Environment[]>;
  docrootSelected: boolean;
  environmentSelected: boolean;
  docrootCode: string;
  envCode: string;
  websiteDeployed: WebsiteDeployed = new WebsiteDeployed();
  private sub$: Subscription = new Subscription();

  constructor(
    private docrootService: DocrootService,
    private environmentService: EnvironmentService,
    public dialogRef: MatDialogRef<DeployWebsiteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.docrootSelected = false;
    this.environmentSelected = false;

    this.formGroup = new FormGroup({
      website: new FormControl(this.data.website.name, [Validators.required]),
      version: new FormControl('N/A', [Validators.required]),
      docroot: new FormControl('', [Validators.required]),
      environment: new FormControl('', [Validators.required])
    });

    this.docroots$ = this.formGroup.controls.docroot.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.docrootService.getAllDocrootsByName(query).pipe(map((page) => page.content));
      })
    );

    this.environments$ = this.formGroup.controls.environment.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.environmentService.getAllEnvironmentsByName(query).pipe(map((page) => page.content));
      })
    );
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    this.websiteDeployed.websiteVersion = this.formGroup.controls.version.value;
    this.sub$.add(
      this.docrootService
        .createOrUpdateSite(this.envCode, this.docrootCode, this.data.website.code, this.websiteDeployed)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe(() => this.dialogRef.close())
    );
  }

  selectedObject(type: number, project: Docroot | Environment): void {
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

  displayFn(project: Docroot | Environment): string {
    return project.name;
  }

  canActivateButton(): boolean {
    return this.docrootSelected && this.environmentSelected;
  }
}
