import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { DialogData } from '../../../../../shared/models/dialog-data.model';
import { Site } from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { SiteService } from '../../../../../shared/services/tools/incapsula/site.service';

@Component({
  selector: 'stgo-edit-incapsula-site-conf-dialog',
  templateUrl: './edit-incapsula-site-conf-dialog.component.html',
  styleUrls: ['./edit-incapsula-site-conf-dialog.component.css']
})
export class EditIncapsulaSiteConfDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  formGroup: FormGroup;
  saving = false;
  /* tslint:disable-next-line */
  regex: RegExp = /^((\*)|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|((\*\.)?([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,63}?))$/gm;

  private siteIpSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditIncapsulaSiteConfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private siteService: SiteService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let siteIp = '';

    if (this.data.incapsulaSite.ips) {
      siteIp = this.data.incapsulaSite.ips.join('\n');
    }

    const removeSsl: boolean = this.data.incapsulaSite.ssl ? false : true;

    this.formGroup = new FormGroup({
      siteIp: new FormControl(siteIp, [Validators.required, Validators.pattern(this.regex)]),
      removeSSL: new FormControl(removeSsl)
    });
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;

    const siteIp: string[] = this.formGroup.get('siteIp')!.value.match(this.regex);
    const removeSSL: boolean = this.formGroup.get('removeSSL')!.value;

    const site: Site = { domain: null!, siteIp, removeSsl: null!, tests: [] };

    // Configure Ips
    this.siteIpSubscription = this.siteService
      .configureSite(this.data.domainCode, site)
      .pipe(
        switchMap(() => {
          // Configure SSL
          const siteSslConf: Site = { domain: null!, siteIp: null!, removeSsl: removeSSL, tests: [] };
          return this.siteService.configureSite(this.data.domainCode, siteSslConf);
        }),
        finalize(() => (this.saving = false))
      )
      .subscribe(() => this.dialogRef.close(true));
  }

  ngOnDestroy(): void {
    if (this.siteIpSubscription) {
      this.siteIpSubscription.unsubscribe();
    }
  }
}
