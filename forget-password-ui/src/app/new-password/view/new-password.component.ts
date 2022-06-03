import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppState } from '@app/core/app.state';
import { PasswordService, TokenModel } from '@app/shared';
import { environment } from '@env/environment';
import { select, Store } from '@ngrx/store';
import { timer, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { PasswordModel } from '../shared/password.model';

@Component({
  selector: 'stgo-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  static readonly matchingErrorMessage: string = 'new.password.error.password.not.same';
  static readonly policyErrorMessage: string = 'new.password.error.password.policy';

  newPasswordForm: FormGroup;
  hasError = false;
  errorMessage: string;
  private token: Observable<TokenModel>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store<AppState>,
    private passwordService: PasswordService
  ) {}

  ngOnInit() {
    this.token = this.store.pipe(
      select(state => state.password && state.password.token),
      first()
    );
    const regex = new RegExp(
      '(?=.{8,})((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\\d)' +
        '(?=.*[a-zA-Z])(?=.*[€,!?%^.*+=-@#_…()])|(?=.*[a-z])(?=.*[A-Z])(?=.*[€,!?%^.*+=-@#_…()])).*'
    );
    this.newPasswordForm = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.pattern(regex)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.pattern(regex)])
    });
  }

  /*
    Set new password and go back to home
  */
  setNewPassword(): void {
    if (!this.checkPassword(this.newPasswordForm.value.password, this.newPasswordForm.value.confirmPassword)) {
      this.hasError = true;
      this.errorMessage = NewPasswordComponent.matchingErrorMessage;
      timer(5000).subscribe(() => {
        this.hasError = false;
        this.errorMessage = '';
      });
      return;
    }

    if (!this.newPasswordForm.valid) {
      return;
    }

    this.token.subscribe((token: TokenModel) => {
      const passwordReset = new PasswordModel(
        token.resourceId.replace(/-/g, ''),
        this.newPasswordForm.value.password,
        this.newPasswordForm.value.confirmPassword
      );
      this.passwordService.updatePassword(passwordReset).subscribe(
        () => {
          this.document.location.href = environment.extranetUrl;
        },
        () => {
          this.hasError = true;
          this.errorMessage = NewPasswordComponent.policyErrorMessage;
          timer(10000).subscribe(() => {
            this.hasError = false;
            this.errorMessage = '';
          });
        }
      );
    });
  }

  private checkPassword(password: string, confirm: string): boolean {
    return password === confirm;
  }
}
