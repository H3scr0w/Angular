import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@core';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'stgo-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.css']
})
export class ProfileInformationComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  user: User;
  editing = false;
  private initSubscription: ISubscription;
  private saveSubscription: ISubscription;

  constructor(private userService: UserService, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Zs-]*$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Zs-]*$')]),
      company: new FormControl('', [Validators.required])
    });
    this.initSubscription = this.userService.getUser(this.authenticationService.credentials.email).subscribe((user) => {
      this.user = user;
      this.profileForm = new FormGroup({
        email: new FormControl(this.authenticationService.credentials.email, [Validators.required, Validators.email]),
        firstname: new FormControl(user.firstname, [Validators.required, Validators.pattern('^[a-zA-Zs-]*$')]),
        lastname: new FormControl(user.lastname, [Validators.required, Validators.pattern('^[a-zA-Zs-]*$')]),
        company: new FormControl(user.company, [Validators.required])
      });
    });
  }

  ngOnDestroy(): void {
    this.initSubscription.unsubscribe();
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  edit(): void {
    this.editing = true;
    this.user.firstname = this.profileForm.get('firstname')!.value;
    this.user.lastname = this.profileForm.get('lastname')!.value;
    this.user.company = this.profileForm.get('company')!.value;
    this.saveSubscription = this.userService
      .updateProfile(this.user.email, this.user)
      .pipe(finalize(() => (this.editing = false)))
      .subscribe((user) => (this.user = user));
  }
}
