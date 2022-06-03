import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { User } from '../../../../shared/models/user.model';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'stgo-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  saving = false;
  userForm: FormGroup;
  newUser: User = new User();

  private saveSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if (this.data.user) {
      this.userForm = new FormGroup({
        email: new FormControl(this.data.user.email, [Validators.required, Validators.email]),
        firstname: new FormControl(this.data.user.firstname, [Validators.required]),
        lastname: new FormControl(this.data.user.lastname, [Validators.required]),
        company: new FormControl(this.data.user.company, [Validators.required]),
        isAdmin: new FormControl(this.data.user.isAdmin)
      });
    } else {
      this.userForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Zs-]*$')]),
        lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Zs-]*$')]),
        company: new FormControl('', [Validators.required]),
        isAdmin: new FormControl(false)
      });
    }
  }

  ngOnDestroy(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.saving = true;

    this.newUser.email = this.userForm.get('email')!.value;
    this.newUser.firstname = this.userForm.get('firstname')!.value;
    this.newUser.lastname = this.userForm.get('lastname')!.value;
    this.newUser.isAdmin = this.userForm.get('isAdmin')!.value;
    this.newUser.company = this.userForm.get('company')!.value;

    this.saveSubscription = this.userService
      .createOrUpdateUser(this.newUser.email, this.newUser)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
