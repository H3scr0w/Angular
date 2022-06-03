import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { DialogData } from '../../../../../shared/models/dialog-data.model';
import { Server } from '../../../../../shared/models/server.model';
import { DocrootService } from '../../../../../shared/services/docroot.service';
import { ServerService } from '../../../../../shared/services/server.service';
import { AddDocrootenvDialogComponent } from './../../add-docrootenv/add-docrootenv-dialog.component';
@Component({
  selector: 'stgo-add-server-dialog',
  templateUrl: './add-server-dialog.component.html',
  styleUrls: ['./add-server-dialog.component.css']
})
export class AddServerDialogComponent implements OnDestroy, OnInit {
  formGroup: FormGroup;
  servers$: Observable<Server[]>;
  saving = false;
  serverSelected = false;
  private docrootEnvSubscription: ISubscription;

  constructor(
    private docrootService: DocrootService,
    private serverService: ServerService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<AddDocrootenvDialogComponent>
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      server: new FormControl()
    });

    this.servers$ = this.formGroup.controls.server.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.serverService.getAllServersByName(query).pipe(map((page) => page.content));
      })
    );
  }

  confirm(): void {
    this.saving = true;
    this.docrootEnvSubscription = this.docrootService
      .createOrUpdateServer(this.data.environmentCode, this.data.docrootCode, this.formGroup.get('server')!.value)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  ngOnDestroy(): void {
    if (this.docrootEnvSubscription) {
      this.docrootEnvSubscription.unsubscribe();
    }
  }
}
