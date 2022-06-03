import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogData } from '../../../../../shared/models/dialog-data.model';
import { Website } from '../../../../../shared/models/website.model';
import { WebsiteService } from '../../../../../shared/services/website.service';

@Component({
  selector: 'stgo-edit-website',
  templateUrl: './edit-website.component.html',
  styleUrls: ['./edit-website.component.css']
})
export class EditWebsiteComponent implements OnInit, OnDestroy {
  saving = false;
  websiteForm: FormGroup;
  newWebsite: Website = new Website();

  private saveSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditWebsiteComponent>,
    private websiteService: WebsiteService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.websiteForm = new FormGroup({
      code: new FormControl(this.data.website.code, [Validators.required]),
      name: new FormControl(this.data.website.name, [Validators.required]),
      codeRepositoryUrl: new FormControl(this.data.website.codeRepositoryUrl, [Validators.required]),
      binaryRepositoryUrl: new FormControl(this.data.website.binaryRepositoryUrl, [Validators.required]),
      homeDirectory: new FormControl(this.data.website.homeDirectory, [Validators.required]),
      enable: new FormControl(this.data.website.enable),
      qualysWebAppId: new FormControl(this.data.website.qualysWebAppId),
      isQualysEnable: new FormControl(this.data.website.isQualysEnable),
      isLive: new FormControl(this.data.website.isLive)
    });
  }

  ngOnDestroy(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.saving = true;

    this.newWebsite.code = this.websiteForm.get('code')!.value;
    this.newWebsite.name = this.websiteForm.get('name')!.value;
    this.newWebsite.codeRepositoryUrl = this.websiteForm.get('codeRepositoryUrl')!.value;
    this.newWebsite.binaryRepositoryUrl = this.websiteForm.get('binaryRepositoryUrl')!.value;
    this.newWebsite.homeDirectory = this.websiteForm.get('homeDirectory')!.value;
    this.newWebsite.enable = this.websiteForm.get('enable')!.value;
    this.newWebsite.qualysWebAppId = this.websiteForm.get('qualysWebAppId')!.value;
    this.newWebsite.isQualysEnable = this.websiteForm.get('isQualysEnable')!.value;
    this.newWebsite.isLive = this.websiteForm.get('isLive')!.value;

    this.saveSubscription = this.websiteService
      .createOrUpdateWebsite(this.newWebsite.code, this.newWebsite)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
