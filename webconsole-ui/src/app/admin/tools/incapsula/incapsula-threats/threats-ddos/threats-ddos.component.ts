import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../../shared/models/domain.model';
import {
  ActivationMode,
  Rule,
  ThreatsConfiguration,
  ThreatRules,
  Waf
} from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { ConfigurationService } from '../../../../../shared/services/tools/incapsula/configuration.service';

@Component({
  selector: 'stgo-threats-ddos',
  templateUrl: './threats-ddos.component.html',
  styleUrls: ['./threats-ddos.component.css']
})
export class ThreatsDdosComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  wafConf: Waf;
  @Input()
  isAdmin: boolean;

  defaultMode: string = ActivationMode.auto;
  modes: string[] = Object.keys(ActivationMode);

  defaultThreshold = 1000;
  thresholds: number[] = [10, 20, 50, 100, 200, 500, 750, 1000, 2000, 3000, 4000, 5000];

  formGroup: FormGroup;
  saving = false;

  private ddos$: Subscription;

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      mode: new FormControl(this.defaultMode),
      threshold: new FormControl(this.defaultThreshold)
    });

    if (this.wafConf.rules && this.wafConf.rules.length > 0) {
      const ruleDdos: Rule[] = this.wafConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.threats.', '') === ThreatRules.ddos
      );

      if (ruleDdos && ruleDdos.length === 1) {
        const rule: Rule = ruleDdos[0];
        const mode = this.modes.find(
          (m) => m === rule.activation_mode.replace('api.threats.ddos.activation_mode.', '')
        );
        this.formGroup.get('mode')!.setValue(mode);
        this.formGroup.get('threshold')!.setValue(rule.ddos_traffic_threshold);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.ddos$) {
      this.ddos$.unsubscribe();
    }
  }

  save(): void {
    this.saving = true;
    const threatsConfiguration: ThreatsConfiguration = new ThreatsConfiguration();
    threatsConfiguration.ruleId = ThreatRules.ddos;
    const mode: string = this.formGroup.get('mode')!.value;
    threatsConfiguration.activationMode = ActivationMode[mode];
    threatsConfiguration.ddosTrafficThreshold = this.formGroup.get('threshold')!.value;

    this.ddos$ = this.configurationService
      .configureSecurity(this.domain.code, threatsConfiguration)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.wafConf.rules
          .filter((rule: Rule) => rule.id.replace('api.threats.', '') === ThreatRules.ddos)
          .map((rule: Rule) => {
            rule.activation_mode = 'api.threats.ddos.activation_mode.' + mode.toLowerCase();
            rule.ddos_traffic_threshold = threatsConfiguration.ddosTrafficThreshold;
          });
      });
  }
}
