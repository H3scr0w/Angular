import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../shared/models/domain.model';
import { Site } from '../../../../shared/models/tools/incapsula/incapsula-data.model';
import { SiteService } from '../../../../shared/services/tools/incapsula/site.service';

@Component({
  selector: 'stgo-incapsula-site',
  templateUrl: './incapsula-site.component.html',
  styleUrls: ['./incapsula-site.component.css']
})
export class IncapsulaSiteComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;

  formGroup: FormGroup;
  saving = false;
  /* tslint:disable-next-line */
  regex: RegExp = /^((\*)|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|((\*\.)?([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,63}?))$/gm;
  private siteSubscription: Subscription;

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      siteIp: new FormControl('', [Validators.pattern(this.regex)]),
      removeSSL: new FormControl()
    });
  }

  ngOnDestroy(): void {
    if (this.siteSubscription) {
      this.siteSubscription.unsubscribe();
    }
  }

  confirm(): void {
    this.saving = true;

    const siteIp: string[] = this.formGroup.get('siteIp')!.value.match(this.regex);
    const removeSSL: boolean = this.formGroup.get('removeSSL')!.value;

    const site: Site = { domain: this.domain.code, siteIp, removeSsl: removeSSL, tests: [] };

    this.siteSubscription = this.siteService
      .addSite(site)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe();
  }
}
