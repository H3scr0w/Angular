import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Website } from '../../../../../shared/models/website.model';
import { WebsiteService } from '../../../../../shared/services/website.service';

@Component({
  selector: 'stgo-add-website',
  templateUrl: './add-website.component.html',
  styleUrls: ['./add-website.component.css']
})
export class AddWebsiteComponent implements OnInit, OnDestroy {
  saving = false;
  websiteForm: FormGroup;
  newWebsite: Website = new Website();

  private saveSubscription: Subscription;

  constructor(public dialogRef: MatDialogRef<AddWebsiteComponent>, private websiteService: WebsiteService) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.websiteForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      codeRepositoryUrl: new FormControl('', [Validators.required]),
      binaryRepositoryUrl: new FormControl('', [Validators.required]),
      homeDirectory: new FormControl('', [Validators.required]),
      enable: new FormControl(true),
      qualysWebAppId: new FormControl(),
      isQualysEnable: new FormControl(false),
      isLive: new FormControl(false)
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
