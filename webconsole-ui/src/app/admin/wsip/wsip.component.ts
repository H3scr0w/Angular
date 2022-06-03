import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { Page } from 'src/app/shared/models/page.model';
import { Website } from 'src/app/shared/models/website.model';
import { WebsiteService } from 'src/app/shared/services/website.service';

@Component({
  selector: 'stgo-wsip',
  templateUrl: './wsip.component.html',
  styleUrls: ['./wsip.component.css']
})
export class WsipComponent implements OnInit, OnDestroy {
  refSidenavMenu: string[] = [
    'CMS',
    'Certificate',
    'Docroot',
    'Docroot Core',
    'Docroot Environment',
    'Environment',
    'Hosting Provider',
    'LoadBalancer',
    'Registar',
    'Server',
    'Websites'
  ];
  hostingSidenavMenu: string[] = ['Website Environments'];

  sidenavSelected: string;
  mediaMatch: boolean;
  inputWebsiteControl: FormControl = new FormControl();
  websites$: Observable<Website[]>;
  website: Website;
  isLoading = false;
  websiteSelected = false;

  private breakpointSubscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private websiteService: WebsiteService,
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
    this.sidenavSelected = 'CMS';
    this.websites$ = this.inputWebsiteControl.valueChanges.pipe(
      startWith(),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.isLoading = true;
        return this.websiteService.getWebsitesByName(query, true).pipe(
          finalize(() => (this.isLoading = false)),
          map((page: Page<Website>) => page.content)
        );
      })
    );
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  show(sidenavSelected: string): void {
    this.sidenavSelected = sidenavSelected;
  }

  changeWebsite(website: Website): void {
    this.websiteSelected = false;
    if (website) {
      this.websiteSelected = true;
      this.website = website;
      this.changeDetectorRef.detectChanges();
    }
  }

  closed(): void {
    const website: Website = this.inputWebsiteControl.value;

    if (!website) {
      this.websiteSelected = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  opened(): void {
    this.websiteSelected = false;
  }

  displayFn(website: Website): string {
    if (website) {
      return website.name;
    }
    return '';
  }
}
