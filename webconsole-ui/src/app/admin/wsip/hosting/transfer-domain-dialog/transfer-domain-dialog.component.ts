import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { DialogData } from 'src/app/shared/models/dialog-data.model';
import { Docroot } from 'src/app/shared/models/docroot.model';
import { Environment } from 'src/app/shared/models/environment.model';
import { DocrootService } from 'src/app/shared/services/docroot.service';
import { DomainService } from 'src/app/shared/services/domain.service';
import { EnvironmentService } from 'src/app/shared/services/environment.service';

@Component({
  selector: 'stgo-transfer-domain-dialog',
  templateUrl: './transfer-domain-dialog.component.html',
  styleUrls: ['./transfer-domain-dialog.component.scss']
})
export class TransferDomainDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;
  docroots$: Observable<Docroot[]>;
  environments$: Observable<Environment[]>;
  docrootSelected: boolean;
  environmentSelected: boolean;
  docrootCode: string;
  envCode: string;

  private sub$: Subscription = new Subscription();

  constructor(
    private docrootService: DocrootService,
    private environmentService: EnvironmentService,
    private domainService: DomainService,
    public dialogRef: MatDialogRef<TransferDomainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.docrootSelected = false;
    this.environmentSelected = false;

    this.formGroup = new FormGroup({
      website: new FormControl(this.data.website.name, [Validators.required]),
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
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.saving = true;

    this.sub$.add(
      this.domainService
        .transfer(this.data.domain.code, this.data.website.code, this.docrootCode, this.envCode)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe(() => this.dialogRef.close(true))
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
