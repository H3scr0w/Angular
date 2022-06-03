import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AppState } from '../../core/webconsole/app.state';
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
import { Website } from '../../shared/models/website.model';
import { DomainService } from '../../shared/services/domain.service';
import { SiteService } from '../../shared/services/tools/incapsula/site.service';
import { WebsiteService } from '../../shared/services/website.service';

@Component({
  selector: 'stgo-security-reports',
  templateUrl: './security-reports.component.html',
  styleUrls: ['./security-reports.component.css']
})
export class SecurityReportsComponent implements OnInit, OnDestroy {
  incapsulaSidenavMenu: string[] = ['Site Configuration', 'DNS', 'SSL', 'Cache', 'Acls', 'Threats', 'Monitoring'];

  sidenavSelected: string;
  mediaMatch: boolean;

  domains$: Observable<Domain[]>;
  domain: Domain;
  isDomainAdmin: boolean;

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
  websiteSelected = false;
  website: Website;
  formGroup: FormGroup;

  private breakpointSubscription: Subscription;
  private initSubscription: Subscription;
  private domainAdminSubscription: Subscription;

  constructor(
    breakpointObserver: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef,
    private domainService: DomainService,
    private siteService: SiteService,
    private websiteService: WebsiteService,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {
    this.breakpointSubscription = breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.mediaMatch = result.matches;
        if (result.matches) {
          changeDetectorRef.detectChanges();
        }
      });
  }

  ngOnInit(): void {
    this.store
      .pipe(select((state) => state && state.website && state.website.website))
      .subscribe((website: Website) => {
        if (website) {
          this.isLoading = true;
          this.websiteSelected = true;
          this.domains$ = this.websiteService.getWebsiteDomains(website.code, true).pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            map((domains: Domain[]) => {
              if (!domains || domains.length === 0) {
                this.snackBar.open(
                  'No domain found in Incapsula linked to this website. Ask an admin for adding your website in WAF',
                  '',
                  {
                    duration: 4000,
                    panelClass: 'info',
                    verticalPosition: 'bottom',
                    horizontalPosition: 'end'
                  }
                );
              }
              return domains;
            })
          );
        }
      });

    this.sidenavSelected = 'Site Configuration';
    this.formGroup = new FormGroup({
      domain: new FormControl('', [Validators.required])
    });
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }
    if (this.domainAdminSubscription) {
      this.domainAdminSubscription.unsubscribe();
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

        this.domainAdminSubscription = this.domainService.isAdmin(code).subscribe((result: boolean) => {
          this.isDomainAdmin = result;
        });

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
