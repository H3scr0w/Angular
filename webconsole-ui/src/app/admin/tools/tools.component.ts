import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { Domain } from '../../shared/models/domain.model';
import {
  Acls,
  CustomCertificate,
  Dn,
  GeneratedCertificate,
  IncapsulaResponse,
  OriginalDn,
  PerformanceConfiguration,
  Waf
} from '../../shared/models/tools/incapsula/incapsula-data.model';
import { DomainService } from '../../shared/services/domain.service';
import { SiteService } from '../../shared/services/tools/incapsula/site.service';

@Component({
  selector: 'stgo-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit, OnDestroy {
  qualysSidenavMenu: string[] = ['Report', 'Scan', 'WebApp', 'WebAppAuthRecord'];
  incapsulaSidenavMenu: string[] = [
    'Site',
    'Site Configuration',
    'DNS',
    'SSL',
    'Cache',
    'Acls',
    'Threats',
    'Monitoring'
  ];

  sidenavSelected: string;
  mediaMatch: boolean;

  domains$: Observable<Domain[]>;
  domain: Domain;

  siteConfs: IncapsulaResponse[];
  generatedCertificate: GeneratedCertificate[];
  customCertificate: CustomCertificate[];
  originalDn: OriginalDn[];
  dn: Dn[];
  cacheConf: PerformanceConfiguration;
  wafConf: Waf;
  aclsConf: Acls;

  isLoading = false;
  domainSelected = false;
  formGroup: FormGroup;

  private breakpointSubscription: Subscription;
  private initSubscription: Subscription;

  constructor(
    breakpointObserver: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef,
    private domainService: DomainService,
    private siteService: SiteService
  ) {
    this.breakpointSubscription = breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.mediaMatch = result.matches;
        if (result.matches) {
          changeDetectorRef.detectChanges();
        }
      });

    this.formGroup = new FormGroup({
      domain: new FormControl('', [Validators.required])
    });

    this.domains$ = this.formGroup.controls.domain.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.isLoading = true;
        return this.domainService.getAllDomainsByNameAndWaf(query).pipe(
          finalize(() => (this.isLoading = false)),
          map((page) => page.content)
        );
      })
    );
  }

  ngOnInit(): void {
    this.sidenavSelected = 'Report';
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }
  }

  getSiteStatus(code: string): void {
    this.isLoading = true;
    this.initSubscription = this.siteService
      .getSiteStatus(code)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response: IncapsulaResponse) => {
        this.siteConfs = [response];

        if (response.ssl && response.ssl.generated_certificate) {
          this.generatedCertificate = [response.ssl.generated_certificate];
        }

        if (response.ssl && response.ssl.custom_certificate) {
          this.customCertificate = [response.ssl.custom_certificate];
        }

        if (response.security) {
          this.wafConf = response.security.waf;
          this.aclsConf = response.security.acls;
        }

        this.cacheConf = response.performance_configuration;
        this.originalDn = response.original_dns;
        this.dn = response.dns;

        this.domainSelected = true;
        this.changeDetectorRef.detectChanges();
      });
  }

  changeDomain(domain: Domain): void {
    this.domainSelected = false;
    this.getSiteStatus(domain.code);
  }

  closed(): void {
    this.domain = this.formGroup.controls.domain.value;

    if (!this.domain) {
      this.domainSelected = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  displayFn(domain: Domain): string {
    return domain.name;
  }

  show(sidenavSelected: string): void {
    this.sidenavSelected = sidenavSelected;
  }
}
