import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { DialogData } from '../../../../../shared/models/dialog-data.model';
import { LoadBalancer } from '../../../../../shared/models/loadbalancer.model';
import { DocrootService } from '../../../../../shared/services/docroot.service';
import { LoadBalancerService } from '../../../../../shared/services/load-balancer.service';

@Component({
  selector: 'stgo-dialog-docrootenv-loadbalancer',
  templateUrl: './dialog-docrootenv-loadbalancer.component.html',
  styleUrls: ['./dialog-docrootenv-loadbalancer.component.css']
})
export class DialogDocrootenvLoadbalancerComponent implements OnDestroy, OnInit {
  formGroup: FormGroup;
  loadbalancers$: Observable<LoadBalancer[]>;
  saving = false;
  loadbalancerSelected = false;
  private docrootEnvSubscription: ISubscription;

  constructor(
    private docrootService: DocrootService,
    private loadbalancerService: LoadBalancerService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<DialogDocrootenvLoadbalancerComponent>
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      loadbalancer: new FormControl()
    });

    this.loadbalancers$ = this.formGroup.controls.loadbalancer.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.loadbalancerService.getAllLoadBalancersByName(query).pipe(map((page) => page.content));
      })
    );
  }

  confirm(): void {
    this.saving = true;

    const loadbalancer: LoadBalancer = this.formGroup.get('loadbalancer')!.value;

    this.docrootEnvSubscription = this.docrootService
      .createOrUpdateLoadBalancer(this.data.environmentCode, this.data.docrootCode, loadbalancer.code, loadbalancer)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  ngOnDestroy(): void {
    if (this.docrootEnvSubscription) {
      this.docrootEnvSubscription.unsubscribe();
    }
  }

  selectedObject(code: string): void {
    this.loadbalancerSelected = true;
  }

  displayFn = (loadbalancer: LoadBalancer) => {
    if (loadbalancer) {
      return loadbalancer.name;
    }
    return '';
  }
}
