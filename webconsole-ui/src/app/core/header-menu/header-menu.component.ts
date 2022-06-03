import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Menu } from '../../shared/menu-constant';
import { Page } from '../../shared/models/page.model';
import { websiteGetAction, websiteUserGetAction } from '../webconsole/website.action';
import { Website } from './../../shared/models/website.model';
import { WebsiteService } from './../../shared/services/website.service';
import { AppState } from './../webconsole/app.state';

/**
 * The header menu component
 */
@Component({
  selector: 'stgo-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {
  @Input()
  menu: Menu;
  websites$: Observable<Website[]>;
  filteredWebsites$: Observable<Website[]>;
  inputFormControl: FormControl = new FormControl();
  navbarOpen = false;

  constructor(private websiteService: WebsiteService, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.websites$ = this.inputFormControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.websiteService.getWebsitesByName(query, true).pipe(map((page: Page<Website>) => page.content));
      })
    );
  }

  onSelectionChange(website: Website): void {
    if (website.code) {
      const code = website.code;
      this.store.dispatch(websiteGetAction({ code }));
      this.store.dispatch(websiteUserGetAction({ code }));
    }
  }

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }
}
