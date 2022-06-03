import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { HostingProvider } from '../../../../shared/models/hosting-provider.model';
import { LoadBalancer } from '../../../../shared/models/loadbalancer.model';
import { Page } from '../../../../shared/models/page.model';
import { HostingProviderService } from '../../../../shared/services/hosting-provider.service';
import { LoadBalancerService } from '../../../../shared/services/load-balancer.service';

@Component({
  selector: 'stgo-edit-loadbalancer-dialog',
  templateUrl: './edit-loadbalancer-dialog.component.html',
  styleUrls: ['./edit-loadbalancer-dialog.component.css']
})
export class EditLoadbalancerDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  ipForm: FormGroup;
  saving = false;
  private domainSubscription: ISubscription;

  hostingProvider$: Observable<HostingProvider[]>;
  hasHostingProviderSelected = false;
  hostingProvider: HostingProvider;

  constructor(
    public dialogRef: MatDialogRef<EditLoadbalancerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loadBalancerService: LoadBalancerService,
    private hostingProviderService: HostingProviderService
  ) {
    if (this.data.loadBalancer) {
      this.hasHostingProviderSelected = true;

      this.ipForm = new FormGroup(
        {
          ip: new FormControl(this.data.loadBalancer.ip, [
            Validators.pattern(
              '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
            )
          ]),
          ip2: new FormControl(this.data.loadBalancer.ip2, [
            Validators.pattern(
              '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
            )
          ])
        },
        { validators: this.ipValidator(), updateOn: 'blur' }
      );

      this.formGroup = new FormGroup({
        code: new FormControl(this.data.loadBalancer.code),
        name: new FormControl(this.data.loadBalancer.name),
        hostingProvider: new FormControl({
          code: this.data.loadBalancer.hostingProviderCode,
          name: this.data.loadBalancer.hostingProviderName
        }),
        ipForm: this.ipForm,
        fqdn: new FormControl(this.data.loadBalancer.fqdn)
      });
    } else {
      this.ipForm = new FormGroup(
        {
          ip: new FormControl('', [
            Validators.pattern(
              '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
            )
          ]),
          ip2: new FormControl('', [
            Validators.pattern(
              '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
            )
          ])
        },
        { validators: this.ipValidator(), updateOn: 'blur' }
      );

      this.formGroup = new FormGroup({
        code: new FormControl(),
        name: new FormControl(),
        hostingProvider: new FormControl(),
        ipForm: this.ipForm,
        fqdn: new FormControl()
      });
    }
  }

  ngOnInit(): void {
    this.hostingProvider$ = this.formGroup.controls.hostingProvider.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.hostingProviderService
          .getAllHostingProvidersByName(query)
          .pipe(map((page: Page<HostingProvider>) => page.content));
      })
    );
  }

  ngOnDestroy(): void {
    if (this.domainSubscription) {
      this.domainSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    const loadBalancer: LoadBalancer = new LoadBalancer();
    loadBalancer.name = this.formGroup.get('name')!.value;
    loadBalancer.code = this.formGroup.get('code')!.value;
    loadBalancer.hostingProviderCode = this.hostingProvider
      ? this.hostingProvider.code
      : this.data.loadBalancer.hostingProviderCode;
    loadBalancer.ip = this.ipForm.get('ip')!.value;
    loadBalancer.ip2 = this.ipForm.get('ip2')!.value;
    loadBalancer.fqdn = this.formGroup.get('fqdn')!.value;

    this.domainSubscription = this.loadBalancerService
      .createOrUpdate(loadBalancer.code, loadBalancer)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  selectHostingProvider(action: boolean, hostingProviderSelected?: HostingProvider): void {
    if (hostingProviderSelected) {
      this.hostingProvider = hostingProviderSelected;
    }
    this.hasHostingProviderSelected = action;
  }

  displayFn = (hostingProvider: HostingProvider) => {
    if (hostingProvider) {
      return hostingProvider.name;
    }
    return '';
  }

  ipValidator(): ValidatorFn {
    const fn = (group: FormGroup): ValidationErrors | null => {
      const ip = group.controls.ip;
      const ip2 = group.controls.ip2;
      if (ip.value !== '' && ip.value === ip2.value) {
        const errors = ip2.errors;
        // add to other errors
        ip2.setErrors({ ...errors, equivalent: true });
        return { equivalent: true };
      } else {
        const errors = ip2.errors;
        ip2.setErrors(null);
        // keep other errors
        ip2.setErrors(errors);
        return null;
      }
    };
    return fn as ValidatorFn;
  }
}
