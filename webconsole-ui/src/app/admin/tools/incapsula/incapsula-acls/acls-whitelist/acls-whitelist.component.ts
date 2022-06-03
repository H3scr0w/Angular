import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../../shared/models/domain.model';
import {
  Acls,
  AclsConfiguration,
  AclsRules,
  Rule
} from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { ConfigurationService } from '../../../../../shared/services/tools/incapsula/configuration.service';

@Component({
  selector: 'stgo-acls-whitelist',
  templateUrl: './acls-whitelist.component.html',
  styleUrls: ['./acls-whitelist.component.css']
})
export class AclsWhitelistComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  aclsConf: Acls;
  @Input()
  isAdmin: boolean;

  // Ips
  ELEMENT_DATA_IP: string[] = [];
  ipsDataSource = new MatTableDataSource(this.ELEMENT_DATA_IP);
  ipColumns: string[] = ['ip', 'actions'];
  ipFormGroup: FormGroup;
  savingIps = false;

  private ips$: Subscription;

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    /* tslint:disable-next-line */
    const ipSubnetRegex: RegExp = /^(((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(((\/([4-9]|[12][0-9]|3[0-2]))?)|\s?-\s?((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))))$)/gm;

    this.ipFormGroup = new FormGroup({
      ip: new FormControl('', [Validators.pattern(ipSubnetRegex)])
    });

    if (this.aclsConf.rules && this.aclsConf.rules.length > 0) {
      const ruleIps: Rule[] = this.aclsConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.acl.', '') === AclsRules.whitelisted_ips
      );

      // Ips
      if (ruleIps && ruleIps.length === 1) {
        const rule: Rule = ruleIps[0];
        this.ipsDataSource = new MatTableDataSource();
        this.ipsDataSource.data = rule.ips;
      }
    }

    this.ELEMENT_DATA_IP = this.ELEMENT_DATA_IP.concat(this.ipsDataSource.data);
  }

  ngOnDestroy(): void {
    if (this.ips$) {
      this.ips$.unsubscribe();
    }
  }

  addIp(): void {
    const ip: string = this.ipFormGroup.get('ip')!.value;
    this.ELEMENT_DATA_IP.push(ip);
    this.ipsDataSource = new MatTableDataSource(this.ELEMENT_DATA_IP);
  }

  deleteIp(ip: string): void {
    this.ELEMENT_DATA_IP = this.ELEMENT_DATA_IP.filter((data) => data !== ip);
    this.ipsDataSource = new MatTableDataSource(this.ELEMENT_DATA_IP);
  }

  whitelistIps(): void {
    this.savingIps = true;
    const aclsConfiguration: AclsConfiguration = new AclsConfiguration();
    aclsConfiguration.ruleId = AclsRules.whitelisted_ips;
    aclsConfiguration.ips = this.ipsDataSource.data;

    this.ips$ = this.configurationService
      .configureAcl(this.domain.code, aclsConfiguration)
      .pipe(finalize(() => (this.savingIps = false)))
      .subscribe();
  }
}
