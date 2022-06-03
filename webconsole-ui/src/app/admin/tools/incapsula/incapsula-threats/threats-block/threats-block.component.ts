import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  selector: 'stgo-threats-block',
  templateUrl: './threats-block.component.html',
  styleUrls: ['./threats-block.component.css']
})
export class ThreatsBlockComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  wafConf: Waf;
  @Input()
  isAdmin: boolean;

  actionDefault = { value: ThreatActions.block_request, tag: 'Block Request' };
  actions = [
    this.actionDefault,
    {
      value: ThreatActions.disabled,
      tag: 'Ignore'
    },
    {
      value: ThreatActions.alert,
      tag: 'Alert Only'
    },
    {
      value: ThreatActions.block_ip,
      tag: 'Block Ip'
    },
    {
      value: ThreatActions.block_user,
      tag: 'Block User'
    }
  ];

  formGroup: FormGroup;
  saving = false;

  private block$: Subscription;

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      actionRemote: new FormControl(this.actionDefault),
      actionSql: new FormControl(this.actionDefault),
      actionXss: new FormControl(this.actionDefault),
      actionResource: new FormControl(this.actionDefault)
    });

    if (this.wafConf.rules && this.wafConf.rules.length > 0) {
      const ruleRemote: Rule[] = this.wafConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.threats.', '') === ThreatRules.remote_file_inclusion
      );
      const ruleSql: Rule[] = this.wafConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.threats.', '') === ThreatRules.sql_injection
      );
      const ruleXss: Rule[] = this.wafConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.threats.', '') === ThreatRules.cross_site_scripting
      );
      const ruleResource: Rule[] = this.wafConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.threats.', '') === ThreatRules.illegal_resource_access
      );

      if (ruleRemote && ruleRemote.length === 1) {
        const rule: Rule = ruleRemote[0];
        const action = this.actions.find(
          (a) => a.value === ThreatActions[rule.action.replace('api.threats.action.', '')]
        );
        this.formGroup.get('actionRemote')!.setValue(action);
      }

      if (ruleSql && ruleSql.length === 1) {
        const rule: Rule = ruleSql[0];
        const action = this.actions.find(
          (a) => a.value === ThreatActions[rule.action.replace('api.threats.action.', '')]
        );
        this.formGroup.get('actionSql')!.setValue(action);
      }

      if (ruleXss && ruleXss.length === 1) {
        const rule: Rule = ruleXss[0];
        const action = this.actions.find(
          (a) => a.value === ThreatActions[rule.action.replace('api.threats.action.', '')]
        );
        this.formGroup.get('actionXss')!.setValue(action);
      }

      if (ruleResource && ruleResource.length === 1) {
        const rule: Rule = ruleResource[0];
        const action = this.actions.find(
          (a) => a.value === ThreatActions[rule.action.replace('api.threats.action.', '')]
        );
        this.formGroup.get('actionResource')!.setValue(action);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.block$) {
      this.block$.unsubscribe();
    }
  }

  save(): void {
    this.saving = true;
    const threatsConfiguration: ThreatsConfiguration = new ThreatsConfiguration();
    threatsConfiguration.securityRuleAction = this.formGroup.get('actionRemote')!.value.value;
    threatsConfiguration.ruleId = ThreatRules[ThreatRules.remote_file_inclusion];

    this.block$ = this.configurationService
      .configureSecurity(this.domain.code, threatsConfiguration)
      .pipe(
        switchMap(() => {
          threatsConfiguration.securityRuleAction = this.formGroup.get('actionSql')!.value.value;
          threatsConfiguration.ruleId = ThreatRules[ThreatRules.sql_injection];
          return this.configurationService.configureSecurity(this.domain.code, threatsConfiguration);
        }),
        switchMap(() => {
          threatsConfiguration.securityRuleAction = this.formGroup.get('actionXss')!.value.value;
          threatsConfiguration.ruleId = ThreatRules[ThreatRules.cross_site_scripting];
          return this.configurationService.configureSecurity(this.domain.code, threatsConfiguration);
        }),
        switchMap(() => {
          threatsConfiguration.securityRuleAction = this.formGroup.get('actionResource')!.value.value;
          threatsConfiguration.ruleId = ThreatRules[ThreatRules.illegal_resource_access];
          return this.configurationService.configureSecurity(this.domain.code, threatsConfiguration);
        }),
        finalize(() => (this.saving = false))
      )
      .subscribe(() => {
        this.wafConf.rules.map((rule: Rule) => {
          if (rule.id.replace('api.threats.', '') === ThreatRules.remote_file_inclusion) {
            rule.action = 'api.threats.action.' + this.formGroup.get('actionRemote')!.value.value;
          }

          if (rule.id.replace('api.threats.', '') === ThreatRules.sql_injection) {
            rule.action = 'api.threats.action.' + this.formGroup.get('actionSql')!.value.value;
          }

          if (rule.id.replace('api.threats.', '') === ThreatRules.cross_site_scripting) {
            rule.action = 'api.threats.action.' + this.formGroup.get('actionXss')!.value.value;
          }

          if (rule.id.replace('api.threats.', '') === ThreatRules.illegal_resource_access) {
            rule.action = 'api.threats.action.' + this.formGroup.get('actionResource')!.value.value;
          }
        });
      });
  }
}
