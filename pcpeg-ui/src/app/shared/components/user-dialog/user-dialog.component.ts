import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { CampaignModel } from '../../models/campaign.model';
import { UserDirectoryModel } from '../../models/user-directory-model';
import { UserService } from '../../service/directory/user/user.service';
import { MessageService } from '../../service/message/message.service';
import { CampaignService } from './../../service/campaign/campaign.service';
import { IUserDialogData, UserDialogMode } from './user-dialog-data';

@Component({
  selector: 'stgo-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit, OnDestroy {
  isLoading = false;
  users: UserDirectoryModel[];
  userForm: FormGroup;
  campaignMode: UserDialogMode = UserDialogMode.CAMPAIGN;
  authorityMode: UserDialogMode = UserDialogMode.AUTHORITY;
  private sub$: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUserDialogData,
    private userService: UserService,
    private campaignService: CampaignService,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      lastName: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      sgid: new FormControl(null),
      user: new FormControl(null, Validators.required),
      isNotified: new FormControl(false)
    });

    this.onChanges();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onChanges(): void {
    this.sub$.add(
      this.userForm
        .get('lastName')!
        .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((val) => {
          this.getAllDirectoryUsers();
        })
    );
    this.sub$.add(
      this.userForm
        .get('firstName')!
        .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((val) => {
          this.getAllDirectoryUsers();
        })
    );
    this.sub$.add(
      this.userForm
        .get('sgid')!
        .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((val) => {
          this.getAllDirectoryUsers();
        })
    );
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onUserSelected(user: UserDirectoryModel): void {
    if (user && user.stGoSGI) {
      this.userForm.patchValue({
        user
      });

      const firstName: string = this.userForm.get('firstName')!.value;
      const lastName: string = this.userForm.get('lastName')!.value;
      const sgid: string = this.userForm.get('sgid')!.value;
      if (!firstName) {
        this.userForm.patchValue({
          firstName: user.givenName
        });
      }
      if (!lastName) {
        this.userForm.patchValue({
          lastName: user.sn
        });
      }
      if (!sgid) {
        this.userForm.patchValue({
          sgid: user.stGoSGI
        });
      }
    }
  }

  onSubmit(): void {
    if (this.data) {
      if (this.data.mode === this.campaignMode && this.data.campaignData) {
        const campaignData: CampaignModel = this.data.campaignData;
        if (!campaignData.id) {
          return;
        }
        const user: UserDirectoryModel = this.userForm.get('user')!.value;
        const isNotified: boolean = this.userForm.get('isNotified')!.value;
        this.isLoading = true;

        this.sub$.add(
          this.campaignService
            .replaceCorrespondant(campaignData.id.societeSid, campaignData.id.anneeId, user.stGoSGI, isNotified)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => {
              this.messageService.show(this.translateService.instant('user.replace.success'), 'success');
              this.dialogRef.close(true);
            })
        );
      } else if (this.data.mode === this.authorityMode) {
        const user: UserDirectoryModel = this.userForm.get('user')!.value;
        this.dialogRef.close(user);
      }
    }
  }

  private getAllDirectoryUsers(): void {
    const sgid: string = this.userForm.get('sgid')!.value;
    const firstName: string = this.userForm.get('firstName')!.value;
    const lastName: string = this.userForm.get('lastName')!.value;

    if (sgid || firstName || lastName) {
      this.isLoading = true;
      this.sub$.add(
        this.userService
          .getAllDirectoryUsers(sgid, firstName, lastName)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((users: UserDirectoryModel[]) => (this.users = users))
      );
    }
  }
}
