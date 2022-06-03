import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../../shared/models/domain.model';
import {
  Rule,
  ThreatsConfiguration,
  ThreatRules,
  Waf
} from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { ConfigurationService } from '../../../../../shared/services/tools/incapsula/configuration.service';

@Component({
  selector: 'stgo-threats-bot',
  templateUrl: './threats-bot.component.html',
  styleUrls: ['./threats-bot.component.css']
})
export class ThreatsBotComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  wafConf: Waf;
  @Input()
  isAdmin: boolean;

  formGroup: FormGroup;
  saving = false;

  private bot$: Subscription;

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      badbot: new FormControl(),
      challengebot: new FormControl()
    });

    if (this.wafConf.rules && this.wafConf.rules.length > 0) {
      const ruleBot: Rule[] = this.wafConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.threats.', '') === ThreatRules.bot_access_control
      );

      // Country & Continent
      if (ruleBot && ruleBot.length === 1) {
        const rule: Rule = ruleBot[0];
        this.formGroup.get('badbot')!.setValue(rule.block_bad_bots);
        this.formGroup.get('challengebot')!.setValue(rule.challenge_suspected_bots);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.bot$) {
      this.bot$.unsubscribe();
    }
  }

  save(): void {
    this.saving = true;

    const threatsConfiguration: ThreatsConfiguration = new ThreatsConfiguration();
    threatsConfiguration.blockBadBots = this.formGroup.get('badbot')!.value;
    threatsConfiguration.challengeSuspectedBots = this.formGroup.get('challengebot')!.value;
    threatsConfiguration.ruleId = ThreatRules.bot_access_control;

    this.bot$ = this.configurationService
      .configureSecurity(this.domain.code, threatsConfiguration)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.wafConf.rules
          .filter((rule: Rule) => rule.id.replace('api.threats.', '') === ThreatRules.bot_access_control)
          .map((rule: Rule) => {
            rule.block_bad_bots = threatsConfiguration.blockBadBots;
            rule.challenge_suspected_bots = threatsConfiguration.challengeSuspectedBots;
          });
      });
  }
}
