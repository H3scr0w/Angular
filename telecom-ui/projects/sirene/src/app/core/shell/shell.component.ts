import { Component, OnInit } from '@angular/core';
import { Language, Menu, SpinnerService, ToolboxLabel } from '@delivery/stgo-common';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { routerTransition } from '../animations/router.transition';
import { AuthenticationService } from '../authentication/authentication.service';
import { I18nService } from '../i18n/i18n.service';

/**
 * The Shell component
 */
@Component({
  selector: 'stgo-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  providers: [SpinnerService],
  animations: [routerTransition]
})
export class ShellComponent implements OnInit {
  username: string;
  appName: string = environment.appName;
  languages: Language[] = [];
  languageLabel: string;
  logoutLabel: string;
  toolboxLabel: ToolboxLabel;
  menus: Menu[];
  picture: string;
  show: boolean;
  isAdmin: boolean;
  isRsm: boolean;
  isUser: boolean;
  isDoUser: boolean;
  isDoAdmin: boolean;
  protected afterViewInit$ = new BehaviorSubject(null);
  private alive = true;

  /**
   * Instantiate the component
   *
   * @param spinnerService for the spinner at the loading app
   * @param translateService to translate all label
   * @param i18nService to get language
   * @param authenticationService to get current user
   */
  constructor(
    protected spinnerService: SpinnerService,
    private translateService: TranslateService,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService
  ) {
    this.spinnerService.registerLoader(
      new Promise((resolve, reject) => {
        this.afterViewInit$.pipe(takeWhile(() => this.alive)).subscribe(_ => resolve());
      })
    );
    this.spinnerService.load();
  }

  /**
   * Initialize the component
   */
  ngOnInit() {
    this.username = this.authenticationService.credentials.sgid;
    this.picture = environment.whiteAndYellowUrl + '/' + this.username + '.jpg';
    this.setLabels();
    this.translateService.onLangChange.subscribe(() => this.setLabels());
  }

  changeLanguage(language: string): void {
    this.i18nService.language = language;
  }

  logout(): void {
    this.authenticationService.logout();
  }

  private setLabels(): void {
    this.languages = [];
    for (const language of this.i18nService.supportedLanguages) {
      this.languages.push({ key: language, label: this.translateService.instant(language) });
    }

    this.languageLabel = this.translateService.instant('Language');
    this.logoutLabel = this.translateService.instant('Logout');
    this.toolboxLabel = {
      modify: this.translateService.instant('common.modify'),
      save: this.translateService.instant('common.save'),
      cancel: this.translateService.instant('common.cancel'),
      toolboxModify: this.translateService.instant('toolbox.modify'),
      globalTools: this.translateService.instant('toolbox.global.tools'),
      globalToolsTooltip: this.translateService.instant('toolbox.my.tools.tooltip.global'),
      localTools: this.translateService.instant('toolbox.local.tools'),
      localToolsTooltip: this.translateService.instant('toolbox.my.tools.tooltip.local'),
      myTools: this.translateService.instant('toolbox.my.tools'),
      myToolsDescription: this.translateService.instant('toolbox.my.tools.description')
    };

    this.menus = [];

    this.show = this.authenticationService.isBelongGroup();
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isRsm = this.authenticationService.credentials.isRsm;
    this.isUser = this.authenticationService.credentials.isUser;
    this.isDoUser = this.authenticationService.credentials.isDoUser;
    this.isDoAdmin = this.authenticationService.credentials.isDoAdmin;

    if (this.show) {
      if (this.isAdmin) {
        this.menus = [
          {
            title: this.translateService.instant('common.menu.definition'),
            icon: 'fa-wrench',
            children: [
              { title: this.translateService.instant('common.menu.site'), link: '/definition/site' },
              { title: this.translateService.instant('common.menu.company'), link: '/definition/company' },
              { title: this.translateService.instant('common.menu.mailingList'), link: '/definition/mailing-list' },
              { title: this.translateService.instant('common.menu.contact'), link: '/definition/contact' },
              { title: this.translateService.instant('common.menu.bulksite'), link: '/definition/bulk-site' }
            ]
          }
        ];

        this.menus.push({
          title: this.translateService.instant('common.menu.reference'),
          icon: 'fa-book',
          children: [
            { title: this.translateService.instant('common.menu.delegation'), link: '/reference/delegation' },
            { title: this.translateService.instant('common.menu.country'), link: '/reference/country' },
            { title: this.translateService.instant('common.menu.city'), link: '/reference/city' },
            { title: this.translateService.instant('common.menu.sector'), link: '/reference/sector' },
            { title: this.translateService.instant('common.menu.zone'), link: '/reference/zone' },
            { title: this.translateService.instant('common.menu.segmentation'), link: '/reference/segmentation' }
          ]
        });
      } else if (this.isRsm || this.isUser) {
        this.menus = [
          {
            title: this.translateService.instant('common.menu.definition'),
            icon: 'fa-wrench',
            children: [
              { title: this.translateService.instant('common.menu.site'), link: '/definition/site' },
              { title: this.translateService.instant('common.menu.company'), link: '/definition/company' },
              { title: this.translateService.instant('common.menu.contact'), link: '/definition/contact' }
            ]
          }
        ];
      } else {
        this.menus = [
          {
            title: this.translateService.instant('common.menu.definition'),
            icon: 'fa-wrench',
            children: [{ title: this.translateService.instant('common.menu.contact'), link: '/definition/contact' }]
          }
        ];
      }

      if (this.isAdmin || this.isRsm) {
        this.menus.push({
          title: this.translateService.instant('common.menu.request'),
          icon: 'fa-flag',
          children: [
            { title: this.translateService.instant('common.menu.makeRequest'), link: '/request/make-a-request' },
            { title: this.translateService.instant('common.menu.bulkSiteCreation'), link: '/request/bulk-site' }
          ]
        });
      }

      if (this.isAdmin) {
        this.menus.push({
          title: this.translateService.instant('common.menu.supervisor'),
          icon: 'fa-cog',
          children: [
            {
              title: this.translateService.instant('common.menu.requestManagement'),
              link: '/supervisor/requests'
            }
          ]
        });
      }

      if (this.isAdmin || this.isRsm) {
        this.menus.push({
          title: this.translateService.instant('common.menu.report'),
          icon: 'fa-edit',
          children: [{ title: this.translateService.instant('common.menu.siteSupervision'), link: '/report/site' }]
        });
      }

      if (this.isAdmin || this.isRsm || this.isUser) {
        this.menus.push({
          title: this.translateService.instant('common.menu.help'),
          icon: 'fa-question',
          children: [
            { title: this.translateService.instant('common.menu.userManual'), link: '/help/user-manual' },
            { title: this.translateService.instant('common.menu.bestPractices'), url: 'assets/Best_Practices.pdf' }
          ]
        });
      }
    }
  }
}
