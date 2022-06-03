import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'stgo-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  sidenavSelected: string;
  sidenavMenu: string[] = ['Informations', 'Projects'];

  mediaMatch: boolean;

  private breakpointSubscription: Subscription;

  constructor(changeDetectorRef: ChangeDetectorRef, breakpointObserver: BreakpointObserver) {
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
    this.sidenavSelected = 'Informations';
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  show(sidenavSelected: string): void {
    this.sidenavSelected = sidenavSelected;
  }
}
