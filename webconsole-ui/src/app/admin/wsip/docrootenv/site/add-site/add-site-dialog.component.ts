import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { DialogData } from '../../../../../shared/models/dialog-data.model';
import { Website } from '../../../../../shared/models/website.model';
import { DocrootService } from '../../../../../shared/services/docroot.service';
import { WebsiteService } from '../../../../../shared/services/website.service';
import { WebsiteDeployed } from './../../../../../shared/models/website-deployed.model';
import { AddDocrootenvDialogComponent } from './../../add-docrootenv/add-docrootenv-dialog.component';
@Component({
  selector: 'stgo-add-site-dialog',
  templateUrl: './add-site-dialog.component.html',
  styleUrls: ['./add-site-dialog.component.css']
})
export class AddSiteDialogComponent implements OnDestroy, OnInit {
  formGroup: FormGroup;
  sites$: Observable<Website[]>;
  saving = false;
  siteSelected = false;
  private docrootEnvSubscription: ISubscription;

  constructor(
    private docrootService: DocrootService,
    private siteService: WebsiteService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<AddDocrootenvDialogComponent>
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      site: new FormControl(),
      siteVersion: new FormControl()
    });

    this.sites$ = this.formGroup.controls.site.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.siteService.getWebsitesByName(query, true).pipe(map((page) => page.content));
      })
    );
  }

  confirm(): void {
    this.saving = true;
    this.docrootEnvSubscription = this.docrootService
      .createOrUpdateSite(
        this.data.environmentCode,
        this.data.docrootCode,
        this.formGroup.get('site')!.value.code,
        new WebsiteDeployed(this.formGroup.get('siteVersion')!.value)
      )
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  ngOnDestroy(): void {
    if (this.docrootEnvSubscription) {
      this.docrootEnvSubscription.unsubscribe();
    }
  }

  selectedObject(code: string): void {
    this.siteSelected = true;
  }

  displayFn(project: Website): string {
    if (project) {
      return project.name;
    }
    return '';
  }
}
