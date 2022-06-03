import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Credentials } from '../authentication/model/credentials';
import { ConstantMenu, Menu } from './../../shared/menu-constant';
import { UserService } from './../../shared/services/user.service';

import { environment } from '@env/environment';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

/**
 * The header component
 */
@Component({
  selector: 'stgo-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  /**
   * The name of the application
   */
  appName: string = environment.appName;

  support: string = environment.supportUrl;

  git: string = environment.gitUrl;

  menus: Menu[] = [ConstantMenu.WEBSITE_MENU, ConstantMenu.DEPLOYMENT_MENU, ConstantMenu.ADMIN_MENU];

  @Output()
  menuType: EventEmitter<Menu> = new EventEmitter();

  credentials: Credentials;

  firstname: string;

  private initSubscription: ISubscription;

  /**
   * Instantiate the component
   */
  constructor(private authenticationService: AuthenticationService, private userService: UserService) {}

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    this.credentials = this.authenticationService.credentials;
    this.initSubscription = this.userService.getUser(this.authenticationService.credentials.email).subscribe((user) => {
      this.firstname = user.firstname;
    });
  }

  ngOnDestroy(): void {
    this.initSubscription.unsubscribe();
  }

  /**
   * Log out the user
   */
  logout(): void {
    this.authenticationService.logout();
  }
  /**
   * Get the username
   */
  get username(): string {
    return this.credentials ? this.credentials.email : '';
  }
}
