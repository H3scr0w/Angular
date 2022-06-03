import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Language, Menu, SpinnerService, ToolboxLabel } from '@delivery/stgo-common';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
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
  isOrderUser: boolean;
  isPmUser: boolean;
  isRequesterUser: boolean;

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

  /**
   * Change the language
   *
   * @param language to change
   */
  changeLanguage(language: string): void {
    this.i18nService.language = language;
  }

  /**
   * Logout
   */
  logout(): void {
    this.authenticationService.logout();
  }

  /**
   * To set all header labels
   */
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

    this.show = this.authenticationService.isBelongGroup();
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;
    this.isPmUser = this.authenticationService.credentials.isPmUser;
    this.isRequesterUser = this.authenticationService.credentials.isRequesterUser;

    this.menus = [];

    if (this.show) {
      if (this.isAdmin) {
        this.menus.push({
          title: this.translateService.instant('common.menu.orders'),
          icon: 'fa-cart-plus',
          children: [
            {
              title: this.translateService.instant('common.menu.orders.followUp'),
              link: '/orders/follow'
            },
            {
              title: this.translateService.instant('common.menu.orders.make'),
              link: '/orders/make'
            },
            {
              title: this.translateService.instant('common.menu.orders.changeservices'),
              link: '/orders/change-services'
            },
            {
              title: this.translateService.instant('common.menu.orders.ispbandwidth'),
              link: '/orders/isp-bandwidth'
            },
            {
              title: this.translateService.instant('common.menu.orders.catalogreplacement'),
              link: '/orders/catalog-replacement'
            }
          ]
        });
      } else {
        this.menus.push({
          title: this.translateService.instant('common.menu.orders'),
          icon: 'fa-cart-plus',
          children: [
            {
              title: this.translateService.instant('common.menu.orders.followUp'),
              link: '/orders/follow'
            },
            {
              title: this.translateService.instant('common.menu.orders.ispbandwidth'),
              link: '/orders/isp-bandwidth'
            }
          ]
        });
      }

      if (this.isAdmin || this.isOrderUser || this.isPmUser || this.isRequesterUser) {
        this.menus.push({
          title: this.translateService.instant('common.menu.requests'),
          icon: 'fa-flag',
          children: [
            {
              title: this.translateService.instant('common.menu.requests.followUp'),
              link: '/requests/request-follow-up'
            },
            {
              title: this.translateService.instant('common.menu.requests.cancellation.followUp'),
              link: '/requests/cancellation-follow-up'
            },
            {
              title: this.translateService.instant('common.menu.requests.cancellation'),
              link: '/requests/cancellation'
            },
            {
              title: this.translateService.instant('common.menu.requests.make'),
              link: '/requests/make'
            },
            {
              title: this.translateService.instant('common.menu.requests.bulkoperatorresponse'),
              link: '/requests/bulk-operator-response'
            }
          ]
        });
      }
      if (this.isAdmin || this.isPmUser) {
        this.menus.push({
          title: this.translateService.instant('common.menu.catalogs'),
          icon: 'fa-atlas',
          children: [
            { title: this.translateService.instant('common.menu.catalogs.import'), link: '/catalogs/import' },
            { title: this.translateService.instant('common.menu.catalogs.export'), link: '/catalogs/export' },
            { title: this.translateService.instant('common.menu.catalogs.activate'), link: '/catalogs/activate' }
          ]
        });
      } else {
        this.menus.push({
          title: this.translateService.instant('common.menu.catalogs'),
          icon: 'fa-atlas',
          children: [{ title: this.translateService.instant('common.menu.catalogs.export'), link: '/catalogs/export' }]
        });
      }

      if (this.isAdmin || this.isOrderUser || this.isPmUser) {
        this.menus.push({
          title: this.translateService.instant('common.menu.settings'),
          icon: 'fa-cog',
          children: [
            {
              title: this.translateService.instant('operator.mail.template.header'),
              link: '/settings/email-template'
            },
            {
              title: this.translateService.instant('common.menu.settings.exporttemplate'),
              link: '/settings/access-template-setting'
            },
            {
              title: this.translateService.instant('common.menu.settings.operatorparameter'),
              link: '/settings/operator-parameters'
            },
            { title: this.translateService.instant('common.menu.settings.operators'), link: '/settings/operators' },
            { title: this.translateService.instant('common.menu.settings.contracts'), link: '/settings/contracts' },
            { title: this.translateService.instant('common.menu.settings.networks'), link: '/settings/networks' },
            { title: this.translateService.instant('common.menu.settings.catalogs'), link: '/settings/catalogs' },
            {
              title: this.translateService.instant('common.menu.settings.ltctermination'),
              link: '/settings/ltc-terminations'
            },
            {
              title: this.translateService.instant('common.menu.settings.ispcarriers'),
              link: '/settings/isp-carriers'
            },
            {
              title: this.translateService.instant('common.menu.settings.costupperlimits'),
              link: '/settings/cost-upper-limits'
            },
            {
              title: this.translateService.instant('common.menu.settings.acnparameter'),
              link: '/settings/acn-parameters'
            }
          ]
        });
      }

      this.menus.push({
        title: this.translateService.instant('common.menu.help'),
        icon: 'fa-question',
        children: [
          {
            title: this.translateService.instant('common.menu.adminManual'),
            url: 'assets/TOM2_CATALOG_FR.pdf',
            target: '_blank'
          },
          {
            title: this.translateService.instant('common.menu.sgtManual'),
            url: 'assets/TOM2_ORDER_FR.pdf',
            target: '_blank'
          },
          {
            title: this.translateService.instant('common.menu.userEnManual'),
            url: 'assets/TOM2_SGTR_EN.pdf',
            target: '_blank'
          },
          {
            title: this.translateService.instant('common.menu.userFrManual'),
            url: 'assets/TOM2_SGTR_FR.pdf',
            target: '_blank'
          }
        ]
      });
    }
  }
}
