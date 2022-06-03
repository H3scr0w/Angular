import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { PasswordSubmitAction } from '@app/core/password/password.action';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

/**
 * The Home component
 */
@Component({
  selector: 'stgo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;

  captcha: string;

  private captcha$: Subscription;

  /**
   * Instantiate the component
   *
   * @param {Router} router
   * @param {Store<AppState>} store
   */
  constructor(private router: Router, private store: Store<AppState>) {}

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      sgid: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      recaptcha: new FormControl(null, Validators.required)
    });
  }

  /**
   * Destroy the component
   */
  ngOnDestroy(): void {
    if (this.captcha$) {
      this.captcha$.unsubscribe();
    }
  }

  /**
   * Go to reinit password page
   * Send request to get email
   */
  resetPassword(): void {
    if (!this.forgotPasswordForm.valid) {
      return;
    }
    this.store.dispatch(
      new PasswordSubmitAction(this.forgotPasswordForm.value.sgid, this.forgotPasswordForm.value.email, this.captcha)
    );
    this.router.navigate(['success']);
  }

  /**
   * Check captcha
   *
   */
  getCaptcha(captchaToCheck: string): void {
    this.captcha = captchaToCheck;
  }
}
