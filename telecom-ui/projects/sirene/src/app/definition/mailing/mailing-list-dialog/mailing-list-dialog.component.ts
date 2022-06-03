import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MailingList, MailingListService } from '@shared';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

export class Email {
  email: string;
  constructor(email: string) {
    this.email = email;
  }
}

@Component({
  selector: 'stgo-mailing-list-dialog',
  templateUrl: './mailing-list-dialog.component.html',
  styleUrls: ['./mailing-list-dialog.component.scss']
})
export class MailingListDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;
  private mailingListSubscription: Subscription;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: Email[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MailingListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: MailingList,
    private mailingListService: MailingListService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    if (this.data && this.data.mailingList) {
      this.data.mailingList.split(';').forEach(email => {
        this.emails.push(new Email(email));
      });
    }
    this.form = this.formBuilder.group({
      id: this.data ? this.data.id : null,
      emails: ['', [Validators.email]]
    });
  }

  ngOnDestroy(): void {
    if (this.mailingListSubscription) {
      this.mailingListSubscription.unsubscribe();
    }
  }

  onNoClick(): void {
    if (this.data) {
      this.dialogRef.close(this.data.mailingList);
    } else {
      this.dialogRef.close();
    }
  }

  submit(form: FormGroup): void {
    this.isLoading = true;
    const mailingLists = this.emails
      .map(element => {
        return element.email;
      })
      .join(';');
    if (this.data) {
      const mailingList: MailingList = new MailingList(this.data.id, mailingLists, this.data.countries);
      this.mailingListSubscription = this.mailingListService
        .updateMailingList(mailingList)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(result => {
          this.dialogRef.close(result.mailingList);
        });
    } else {
      const mailingList: MailingList = new MailingList(0, mailingLists, null);
      this.mailingListSubscription = this.mailingListService
        .saveMailingList(mailingList)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(result => {
          this.dialogRef.close(result);
        });
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // checking if its an email

    // Add our email
    if (value.trim()) {
      this.emails.push({ email: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(email: Email): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
      this.form.markAsDirty();
    }
  }
}
