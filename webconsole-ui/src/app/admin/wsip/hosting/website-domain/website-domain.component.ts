import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { TransferDomainDialogComponent } from 'src/app/admin/wsip/hosting/transfer-domain-dialog/transfer-domain-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Docroot } from 'src/app/shared/models/docroot.model';
import { Domain } from 'src/app/shared/models/domain.model';
import { Environment } from 'src/app/shared/models/environment.model';
import { Page } from 'src/app/shared/models/page.model';
import { Registar } from 'src/app/shared/models/registar.model';
import { Website } from 'src/app/shared/models/website.model';
import { DomainService } from 'src/app/shared/services/domain.service';
import { RegistarService } from 'src/app/shared/services/registar.service';
import { WebsiteService } from 'src/app/shared/services/website.service';
import { DomainType } from './../../../../shared/models/domain-type';

@Component({
  selector: 'stgo-website-domain',
  templateUrl: './website-domain.component.html',
  styleUrls: ['./website-domain.component.scss']
})
export class WebsiteDomainComponent implements OnInit, OnDestroy {
  @Input()
  website: Website;

  @Input()
  docroot: Docroot;

  @Input()
  environment: Environment;

  isLoading: boolean;

  selectedDomain: Domain;

  selectedParentDomain: Domain;

  treeControl = new NestedTreeControl<Domain>((node) => node.children);

  dataSource = new MatTreeNestedDataSource<Domain>();

  formGroup: FormGroup;

  types = [DomainType.CONTRIBUTION, DomainType.MAIN];

  docrootAuth = 'DocrootEnvAuth';
  basicAuth = 'BasicAuth';

  defaultAuthType = this.docrootAuth;

  hidePassword = true;

  registar$: Observable<Registar[]>;
  hasRegistarSelected = false;
  registar: Registar;

  private sub$: Subscription = new Subscription();

  constructor(
    private websiteService: WebsiteService,
    private domainService: DomainService,
    private registarService: RegistarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getWebsiteDomains();

    this.formGroup = new FormGroup({
      code: new FormControl(),
      type: new FormControl({ value: null, disabled: this.selectedParentDomain }),
      parent: new FormControl(),
      name: new FormControl(),
      registar: new FormControl(),
      httpsEnable: new FormControl(),
      authType: new FormControl(this.defaultAuthType),
      realm: new FormControl(),
      user: new FormControl(),
      password: new FormControl(),
      isQualysEnable: new FormControl(),
      qualysWebAppId: new FormControl(),
      qualysWebAuthId: new FormControl(),
      wafId: new FormControl(),
      isMonitorEnable: new FormControl(),
      monitorKeyword: new FormControl()
    });
    this.formGroup.disable();
    this.registar$ = this.formGroup.controls.registar.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.registarService.getAllRegistarsByName(query).pipe(map((page: Page<Registar>) => page.content));
      })
    );
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  hasChild = (_: number, node: Domain) => !!node.children && node.children.length > 0;

  selectRegistar(action: boolean, registarSelected?: Registar): void {
    if (registarSelected) {
      this.registar = registarSelected;
    }
    this.hasRegistarSelected = action;
  }

  displayFn = (registar: Registar) => {
    if (registar) {
      return registar.name;
    }
    return '';
  }

  selectDomain(domain: Domain, checked: boolean): void {
    this.formGroup.reset();
    this.selectedDomain = domain;
    this.selectedParentDomain = null!;

    if (!checked) {
      this.selectedDomain = null!;
      this.formGroup.disable();
      return;
    }

    this.formGroup.enable();
    this.hasRegistarSelected = domain.registarCode ? true : false;
    domain.children && domain.children.length > 0
      ? (this.types = [DomainType.MAIN])
      : (this.types = [DomainType.MAIN, DomainType.CONTRIBUTION]);
    if (domain.parent) {
      this.types = [DomainType.REDIRECTION];
    }

    this.formGroup.patchValue({
      code: domain.code,
      name: domain.name,
      parent: domain.parent ? domain.parent.name : null,
      type: domain.domainType,
      registar: { code: domain.registarCode, name: domain.registarName },
      httpsEnable: domain.httpsEnable,
      authType: domain.useDocrootEnvAuth ? this.docrootAuth : this.basicAuth,
      realm: domain.realm,
      user: domain.user,
      password: domain.password,
      isQualysEnable: domain.isQualysEnable,
      qualysWebAppId: domain.qualysWebAppId,
      qualysWebAuthId: domain.qualysWebAuthId,
      wafId: domain.wafId,
      isMonitorEnable: domain.isMonitorEnable,
      monitorKeyword: domain.monitorKeyword
    });
  }

  addNewItem(parent: Domain): void {
    if (!parent) {
      this.formGroup.disable();
      return;
    }
    this.types = [DomainType.REDIRECTION];
    this.selectedDomain = null!;
    this.selectedParentDomain = parent;
    this.hasRegistarSelected = false;
    this.formGroup.reset();
    this.formGroup.enable();
    this.formGroup.patchValue({
      parent: parent.name,
      registar: '',
      type: DomainType.REDIRECTION,
      authType: this.defaultAuthType
    });
  }

  confirm(): void {
    this.isLoading = true;
    const domain: Domain = new Domain();

    // Principal
    domain.name = this.formGroup.get('name')!.value;
    domain.code = this.formGroup.get('code')!.value;
    domain.parent = this.selectedParentDomain;
    domain.domainType = this.formGroup.get('type')!.value;
    domain.websiteCode = this.website.code;
    domain.docrootCode = this.docroot.code;
    domain.environmentCode = this.environment.environmentCode;
    domain.registarCode = this.registar
      ? this.registar.code
      : this.selectedDomain
      ? this.selectedDomain.registarCode
      : null!;
    domain.registarName = this.registar
      ? this.registar.name
      : this.selectedDomain
      ? this.selectedDomain.registarName
      : null!;
    domain.httpsEnable = this.formGroup.get('httpsEnable')!.value;

    // Authentication
    domain.useDocrootEnvAuth = this.formGroup.get('authType')!.value === this.docrootAuth;
    domain.isBasicAuth = this.formGroup.get('authType')!.value === this.basicAuth;
    domain.realm = this.formGroup.get('realm')!.value;
    domain.user = this.formGroup.get('user')!.value;
    domain.password = this.formGroup.get('password')!.value;

    // Qualys
    domain.isQualysEnable = this.formGroup.get('isQualysEnable')!.value;
    domain.qualysWebAppId = this.formGroup.get('qualysWebAppId')!.value;
    domain.qualysWebAuthId = this.formGroup.get('qualysWebAuthId')!.value;

    // WAF Id
    domain.wafId = this.formGroup.get('wafId')!.value;

    // Monitor
    domain.isMonitorEnable = this.formGroup.get('isMonitorEnable')!.value;
    domain.monitorKeyword = this.formGroup.get('monitorKeyword')!.value;

    this.sub$.add(
      this.domainService
        .createOrUpdate(domain.code, domain)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(() => {
          this.formGroup.reset();
          this.formGroup.disable();
          this.formGroup.patchValue({
            registar: '',
            authType: this.defaultAuthType
          });
          this.getWebsiteDomains();
        })
    );
  }

  newDomain(): void {
    this.selectedDomain = null!;
    this.selectedParentDomain = null!;
    this.types = [DomainType.CONTRIBUTION, DomainType.MAIN];
    this.formGroup.reset();
    this.formGroup.enable();
    this.formGroup.patchValue({
      registar: '',
      type: DomainType.CONTRIBUTION,
      authType: this.defaultAuthType
    });
  }

  deleteDomain(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.sub$.add(
          this.domainService
            .delete(this.selectedDomain.code)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => {
              this.formGroup.reset();
              this.formGroup.patchValue({
                registar: '',
                authType: this.defaultAuthType
              });
              this.getWebsiteDomains();
            })
        );
      }
    });
  }

  transferDomain(): void {
    const dialogRef = this.dialog.open(TransferDomainDialogComponent, {
      width: '80%',
      disableClose: true,
      data: { domain: this.selectedDomain, website: this.website }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectDomain(null!, false);
        this.getWebsiteDomains();
      }
    });
  }

  private getWebsiteDomains(): void {
    this.isLoading = true;
    this.sub$.add(
      this.websiteService
        .getWebsiteDomains(this.website.code, null!, true, this.docroot.code, this.environment.environmentCode)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (result: Domain[]) =>
            (this.dataSource.data = result.sort((d1, d2) => d1.domainType.localeCompare(d2.domainType)))
        )
    );
  }
}
