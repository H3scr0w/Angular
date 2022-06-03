import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, Credentials } from '@core';
import { SiteService } from '@shared';

/**
 * The Home component
 */
@Component({
  selector: 'stgo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * The credentials
   */
  credentials: Credentials;
  isLoading = false;
  isSireneUser: boolean;
  siteCount: number;

  /**
   * Instantiate the component
   */
  constructor(
    private authenticationService: AuthenticationService,
    private siteService: SiteService,
    private router: Router
  ) {}

  /**
   * Initialize the component
   */
  ngOnInit() {
    this.credentials = this.authenticationService.credentials;
    this.isSireneUser = this.credentials.isAdmin || this.credentials.isRsm || this.credentials.isUser;
    if (this.isSireneUser) {
      this.getSiteCount();
    } else {
      this.router.navigate(['definition/contact']);
    }
  }

  ngOnDestroy() {}

  getSiteCount() {
    return this.siteService.countAll().subscribe(count => (this.siteCount = count));
  }
}
