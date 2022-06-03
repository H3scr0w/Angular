import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService, Credentials } from '@core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../core/webconsole/app.state';
import { Website } from '../../shared/models/website.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'stgo-wsip-configuration',
  templateUrl: './wsip-configuration.component.html',
  styleUrls: ['./wsip-configuration.component.css']
})
export class WsipConfigurationComponent implements OnInit, OnDestroy {
  sidenavSelected: string;
  sidenavMenu: string[] = ['Source code', 'Project Team', 'Hosting'];
  mediaMatch: boolean;
  websiteSelected = false;
  credentials: Credentials;
  firstname: string;
  website: Website;

  private initSubscription: Subscription;
  private breakpointSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private store: Store<AppState>,
    changeDetectorRef: ChangeDetectorRef,
    breakpointObserver: BreakpointObserver
  ) {
    this.breakpointSubscription = breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.mediaMatch = result.matches;
        if (result.matches) {
          changeDetectorRef.detectChanges();
        }
      });
  }

  ngOnInit(): void {
    this.store
      .pipe(select((state) => state && state.website && state.website.website))
      .subscribe((website: Website) => {
        if (website) {
          this.websiteSelected = true;
          this.website = website;
        }
      });
    this.sidenavSelected = 'Source code';
    this.credentials = this.authenticationService.credentials;
    this.initSubscription = this.userService.getUser(this.authenticationService.credentials.email).subscribe((user) => {
      this.firstname = user.firstname;
    });
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }
  }

  show(sidenavSelected: string): void {
    this.sidenavSelected = sidenavSelected;
  }
}
