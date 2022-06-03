import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../../shared/models/domain.model';
import {
  Rule,
  ThreatsConfiguration,
  ThreatActions,
  ThreatRules,
  Waf
} from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { ConfigurationService } from '../../../../../shared/services/tools/incapsula/configuration.service';

@Component({
  selector: 'stgo-threats-backdoor',
  templateUrl: './threats-backdoor.component.html',
  styleUrls: ['./threats-backdoor.component.css']
})
export class ThreatsBackdoorComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  wafConf: Waf;
  @Input()
  isAdmin: boolean;

  ELEMENT_DATA_URL: string[] = [];
  urlsDataSource = new MatTableDataSource(this.ELEMENT_DATA_URL);
  urlColumns: string[] = ['url', 'actions'];
  urlFormGroup: FormGroup;
  saving = false;

  actionDefault = { value: ThreatActions.quarantine_url, tag: 'Auto-Quarantine' };
  actions = [
    this.actionDefault,
    {
      value: ThreatActions.disabled,
      tag: 'Ignore'
    },
    {
      value: ThreatActions.alert,
      tag: 'Alert Only'
    }
  ];

  private backdoor$: Subscription;

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    const urlRegex: RegExp = /^(\/\S*)(?!\/)$/gm;

    this.urlFormGroup = new FormGroup({
      action: new FormControl(this.actionDefault),
      url: new FormControl('', [Validators.pattern(urlRegex)])
    });

    if (this.wafConf.rules && this.wafConf.rules.length > 0) {
      const ruleBackdoor: Rule[] = this.wafConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.threats.', '') === ThreatRules.backdoor
      );

      if (ruleBackdoor && ruleBackdoor.length === 1) {
        const rule: Rule = ruleBackdoor[0];
        const action = this.actions.find(
          (a) => a.value === ThreatActions[rule.action.replace('api.threats.action.', '')]
        );
        this.urlFormGroup.get('action')!.setValue(action);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.backdoor$) {
      this.backdoor$.unsubscribe();
    }
  }

  addUrl(): void {
    const url: string = this.urlFormGroup.get('url')!.value;
    this.ELEMENT_DATA_URL.push(url);
    this.urlsDataSource = new MatTableDataSource(this.ELEMENT_DATA_URL);
  }

  deleteUrl(url: string): void {
    this.ELEMENT_DATA_URL = this.ELEMENT_DATA_URL.filter((data) => data !== url);
    this.urlsDataSource = new MatTableDataSource(this.ELEMENT_DATA_URL);
  }

  save(): void {
    this.saving = true;
    const threatsConfiguration: ThreatsConfiguration = new ThreatsConfiguration();
    threatsConfiguration.securityRuleAction = this.urlFormGroup.get('action')!.value.value;
    threatsConfiguration.ruleId = ThreatRules.backdoor;
    threatsConfiguration.quarantinedUrls = this.urlsDataSource.data;

    this.backdoor$ = this.configurationService
      .configureSecurity(this.domain.code, threatsConfiguration)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.wafConf.rules
          .filter((rule: Rule) => rule.id.replace('api.threats.', '') === ThreatRules.backdoor)
          .map((rule: Rule) => {
            rule.action = 'api.threats.action.' + ThreatActions[threatsConfiguration.securityRuleAction];
          });
      });
  }
}
