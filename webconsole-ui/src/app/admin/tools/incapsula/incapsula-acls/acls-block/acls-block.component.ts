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
  Continents,
  Countries,
  Rule,
  Url,
  UrlPatterns
} from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { ConfigurationService } from '../../../../../shared/services/tools/incapsula/configuration.service';

@Component({
  selector: 'stgo-acls-block',
  templateUrl: './acls-block.component.html',
  styleUrls: ['./acls-block.component.css']
})
export class AclsBlockComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  aclsConf: Acls;
  @Input()
  isAdmin: boolean;

  // Country
  countryList: Countries[] = Object.keys(Countries).map((c) => Countries[c]);
  ELEMENT_DATA_COUNTRY: Countries[] = [];
  countriesDataSource = new MatTableDataSource(this.ELEMENT_DATA_COUNTRY);
  countryColumns: string[] = ['countries'];
  countryFormGroup: FormGroup;
  savingCountry = false;

  // Continent
  continentsList: Continents[] = Object.keys(Continents).map((c) => Continents[c]);
  ELEMENT_DATA_CONTINENT: Continents[] = [];
  continentsDataSource = new MatTableDataSource(this.ELEMENT_DATA_CONTINENT);
  continentColumns: string[] = ['continents'];
  continentFormGroup: FormGroup;
  savingContinent = false;

  // Urls
  patternsList: UrlPatterns[] = Object.keys(UrlPatterns).map((url) => UrlPatterns[url]);
  ELEMENT_DATA_URL: Url[] = [];
  urlsDataSource = new MatTableDataSource(this.ELEMENT_DATA_URL);
  urlColumns: string[] = ['url', 'pattern', 'actions'];
  urlFormGroup: FormGroup;
  savingUrls = false;

  // Ips
  ELEMENT_DATA_IP: string[] = [];
  ipsDataSource = new MatTableDataSource(this.ELEMENT_DATA_IP);
  ipColumns: string[] = ['ip', 'actions'];
  ipFormGroup: FormGroup;
  savingIps = false;

  private country$: Subscription;
  private continent$: Subscription;
  private url$: Subscription;
  private ips$: Subscription;

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    const urlRegex: RegExp = /^(\/\S*)(?!\/)$/gm;
    /* tslint:disable-next-line */
    const ipSubnetRegex: RegExp = /^(((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(((\/([4-9]|[12][0-9]|3[0-2]))?)|\s?-\s?((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))))$)/gm;

    this.countryFormGroup = new FormGroup({
      countries: new FormControl()
    });

    this.continentFormGroup = new FormGroup({
      continents: new FormControl()
    });

    this.urlFormGroup = new FormGroup({
      pattern: new FormControl(),
      url: new FormControl('', [Validators.pattern(urlRegex)])
    });

    this.ipFormGroup = new FormGroup({
      ip: new FormControl('', [Validators.pattern(ipSubnetRegex)])
    });

    if (this.aclsConf.rules && this.aclsConf.rules.length > 0) {
      const ruleCountries: Rule[] = this.aclsConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.acl.', '') === AclsRules.blacklisted_countries
      );
      const ruleUrls: Rule[] = this.aclsConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.acl.', '') === AclsRules.blacklisted_urls
      );
      const ruleIps: Rule[] = this.aclsConf.rules.filter(
        (rule: Rule) => rule.id.replace('api.acl.', '') === AclsRules.blacklisted_ips
      );

      // Country & Continent
      if (ruleCountries && ruleCountries.length === 1) {
        const rule: Rule = ruleCountries[0];
        if (rule.geo) {
          this.countriesDataSource = new MatTableDataSource();
          this.countriesDataSource.data = rule.geo.countries;
          this.continentsDataSource = new MatTableDataSource();
          this.continentsDataSource.data = rule.geo.continents;
        }
      }

      // Urls
      if (ruleUrls && ruleUrls.length === 1) {
        const rule: Rule = ruleUrls[0];
        this.urlsDataSource = new MatTableDataSource();
        this.urlsDataSource.data = rule.urls;
      }

      // Ips
      if (ruleIps && ruleIps.length === 1) {
        const rule: Rule = ruleIps[0];
        this.ipsDataSource = new MatTableDataSource();
        this.ipsDataSource.data = rule.ips;
      }
    }

    this.ELEMENT_DATA_COUNTRY = this.ELEMENT_DATA_COUNTRY.concat(this.countriesDataSource.data);
    this.ELEMENT_DATA_CONTINENT = this.ELEMENT_DATA_CONTINENT.concat(this.continentsDataSource.data);
    this.ELEMENT_DATA_URL = this.ELEMENT_DATA_URL.concat(this.urlsDataSource.data);
    this.ELEMENT_DATA_IP = this.ELEMENT_DATA_IP.concat(this.ipsDataSource.data);
  }

  ngOnDestroy(): void {
    if (this.country$) {
      this.country$.unsubscribe();
    }
    if (this.continent$) {
      this.continent$.unsubscribe();
    }
    if (this.url$) {
      this.url$.unsubscribe();
    }
    if (this.ips$) {
      this.ips$.unsubscribe();
    }
  }

  blockCountries(): void {
    this.savingCountry = true;

    const aclsConfiguration: AclsConfiguration = new AclsConfiguration();
    aclsConfiguration.countries = this.countryFormGroup.get('countries')!.value;
    aclsConfiguration.ruleId = AclsRules.blacklisted_countries;

    this.country$ = this.configurationService
      .configureAcl(this.domain.code, aclsConfiguration)
      .pipe(finalize(() => (this.savingCountry = false)))
      .subscribe(() => {
        this.ELEMENT_DATA_COUNTRY = aclsConfiguration.countries;
        this.countriesDataSource = new MatTableDataSource(this.ELEMENT_DATA_COUNTRY);

        this.ELEMENT_DATA_CONTINENT = [];
        this.continentsDataSource = new MatTableDataSource(this.ELEMENT_DATA_CONTINENT);
      });
  }

  blockContinents(): void {
    this.savingContinent = true;

    const aclsConfiguration: AclsConfiguration = new AclsConfiguration();
    aclsConfiguration.continents = this.continentFormGroup.get('continents')!.value;
    aclsConfiguration.ruleId = AclsRules.blacklisted_countries;

    this.continent$ = this.configurationService
      .configureAcl(this.domain.code, aclsConfiguration)
      .pipe(finalize(() => (this.savingContinent = false)))
      .subscribe(() => {
        this.ELEMENT_DATA_CONTINENT = aclsConfiguration.continents;
        this.continentsDataSource = new MatTableDataSource(this.ELEMENT_DATA_CONTINENT);

        this.ELEMENT_DATA_COUNTRY = [];
        this.countriesDataSource = new MatTableDataSource(this.ELEMENT_DATA_COUNTRY);
      });
  }

  addUrl(): void {
    const value: string = this.urlFormGroup.get('url')!.value;
    const pattern: string = this.urlFormGroup.get('pattern')!.value;
    const url: Url = new Url();
    url.value = value;
    url.pattern = pattern;

    this.ELEMENT_DATA_URL.push(url);
    this.urlsDataSource = new MatTableDataSource(this.ELEMENT_DATA_URL);
  }

  deleteUrl(url: string): void {
    this.ELEMENT_DATA_URL = this.ELEMENT_DATA_URL.filter((data) => data.value !== url);
    this.urlsDataSource = new MatTableDataSource(this.ELEMENT_DATA_URL);
  }

  blockUrls(): void {
    this.savingUrls = true;
    const aclsConfiguration: AclsConfiguration = new AclsConfiguration();
    aclsConfiguration.ruleId = AclsRules.blacklisted_urls;
    aclsConfiguration.urls = this.urlsDataSource.data.map((url: Url) => url.value);
    aclsConfiguration.urlPatterns = this.urlsDataSource.data.map((url: Url) => UrlPatterns[url.pattern.toLowerCase()]);

    this.url$ = this.configurationService
      .configureAcl(this.domain.code, aclsConfiguration)
      .pipe(finalize(() => (this.savingUrls = false)))
      .subscribe();
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

  blockIps(): void {
    this.savingIps = true;
    const aclsConfiguration: AclsConfiguration = new AclsConfiguration();
    aclsConfiguration.ruleId = AclsRules.blacklisted_ips;
    aclsConfiguration.ips = this.ipsDataSource.data;

    this.ips$ = this.configurationService
      .configureAcl(this.domain.code, aclsConfiguration)
      .pipe(finalize(() => (this.savingIps = false)))
      .subscribe();
  }
}
