import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import groupBy from 'lodash/groupBy';
import { of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DeployWebsiteDialogComponent } from 'src/app/admin/wsip/hosting/deploy-website-dialog/deploy-website-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Docroot } from 'src/app/shared/models/docroot.model';
import { Environment } from 'src/app/shared/models/environment.model';
import { Website } from 'src/app/shared/models/website.model';
import { DocrootService } from 'src/app/shared/services/docroot.service';
import { WebsiteService } from 'src/app/shared/services/website.service';
import { DomainType } from '../../../../shared/models/domain-type';
import { Domain } from '../../../../shared/models/domain.model';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DomainGroup {
  code: string;
  domainList: Domain[];
}

@Component({
  selector: 'stgo-website-environment',
  templateUrl: './website-environment.component.html',
  styleUrls: ['./website-environment.component.scss']
})
export class WebsiteEnvironmentComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input()
  website: Website;

  @Input()
  isAdmin: boolean;

  docroots: Docroot[] = [];

  isLoading = false;

  screen = 'environment';

  docroot: Docroot;

  environment: Environment;

  private sub$: Subscription = new Subscription();

  constructor(
    private websiteService: WebsiteService,
    private docrootService: DocrootService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getWebsiteDocroots();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const property in changes) {
      if (property === 'website' && changes[property].currentValue !== changes[property].previousValue) {
        this.getWebsiteDocroots();
      }
    }
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  deployWebsiteEnvironment(): void {
    const dialogRef = this.dialog.open(DeployWebsiteDialogComponent, {
      width: '80%',
      data: { website: this.website }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getWebsiteDocroots();
    });
  }

  deleteWebsiteEnvironment(docrootCode: string, environmentCode: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.sub$.add(
          this.docrootService
            .deleteDocrootSite(environmentCode, docrootCode, this.website.code)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => this.getWebsiteDocroots())
        );
      }
    });
  }

  manageWebsiteDomains(docroot: Docroot, environment: Environment): void {
    this.docroot = docroot;
    this.environment = environment;
    this.screen = 'domain';
  }

  back(): void {
    this.screen = 'environment';
    this.getWebsiteDocroots();
  }

  clearAcquiaVarnish(docroot: Docroot, environment: Environment, domain: Domain): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: "Are you sure you want to clear varnish cache from Acquia ?"
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.sub$.add(
          this.docrootService
            .clearAcquiaVarnish(docroot.code, environment.environmentCode, domain.code)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => {
              this.snackBar.open('Cache successfully cleared', 'OK', {
                duration: 5000,
                panelClass: 'success',
                verticalPosition: 'bottom',
                horizontalPosition: 'end'
              });
              this.getWebsiteDocroots();
            }
            )
        );
      }
    });
  }

  private getWebsiteDocroots(): void {
    if (this.website) {
      this.isLoading = true;
      this.sub$.add(
        this.websiteService
          .getWebsiteDocroots(this.website.code, true)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.docroots = [];
              return of(null);
            }),
            finalize(() => (this.isLoading = false))
          )
          .subscribe((docroots) => {
            if (docroots) {
              docroots.forEach((docroot) => {
                if (docroot && docroot.environments) {
                  docroot.environments.forEach((env) => {
                    if (env && env.domains) {
                      env.domains = env.domains.sort((d1, d2) => d1.domainType.localeCompare(d2.domainType));
                      const domainsGroup = groupBy(env.domains, 'parent.code');
                      const domainArray: DomainGroup[] = [];
                      Object.keys(domainsGroup).map((key, index, array) => {
                        domainArray.push({ code: array[index], domainList: domainsGroup[key] as Domain[] });
                      });

                      const contributionDomains: Domain[] = [];
                      const mainDomains: Domain[] = [];
                      let domainList: Domain[] = [];

                      // CONTRIBUTION
                      domainArray
                        .filter((domainGroup: DomainGroup) => domainGroup.code === 'undefined')
                        .map((domainGroup: DomainGroup) => domainList.push(...domainGroup.domainList));
                      domainList
                        .filter((domain: Domain) => domain.domainType.toUpperCase() === DomainType.CONTRIBUTION)
                        .map((domain: Domain) => contributionDomains.push(domain));

                      // Reset filter
                      domainList = [];

                      // MAIN
                      domainArray
                        .filter((domainGroup: DomainGroup) => domainGroup.code === 'undefined')
                        .map((domainGroup: DomainGroup) => domainList.push(...domainGroup.domainList));
                      domainList
                        .filter((domain: Domain) => domain.domainType.toUpperCase() === DomainType.MAIN)
                        .map((domain: Domain) => mainDomains.push(domain));

                      env.domains = [];
                      // Add Contribution Domains
                      env.domains.push(...contributionDomains);

                      // REDIRECTION
                      for (const domain of mainDomains) {
                        // Add Main domain
                        env.domains.push(domain);
                        // Add Redirection Domain associated to the Main
                        const array = domainArray.filter((domainGroup: DomainGroup) => domainGroup.code === domain.code);
                        for (const domainGroup of array) {
                          env.domains.push(...domainGroup.domainList);
                        }
                      }
                    }
                  });
                }
              });
              this.docroots = docroots.sort((docroot1, docroot2) => docroot1.name.localeCompare(docroot2.name));
            }
          })
      );
    }
  }
}
