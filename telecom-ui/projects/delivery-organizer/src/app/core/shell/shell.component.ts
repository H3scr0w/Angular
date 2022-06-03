import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Language, Menu, SpinnerService, ToolboxLabel } from '@delivery/stgo-common';

import { TranslateService } from '@ngx-translate/core';
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
  sireneContactUrl: string = environment.sireneContactUrl;
  spoSurveyUrl: string = environment.spoSurveyUrl;
  languages: Language[] = [];
  languageLabel: string;
  logoutLabel: string;
  toolboxLabel: ToolboxLabel;
  menus: Menu[];
  picture: string;
  show: boolean;
  isAdmin: boolean;
  isModifyUser: boolean;
  isSupervisor: boolean;

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
    this.isModifyUser = this.authenticationService.credentials.isModifyUser;
    this.isSupervisor = this.authenticationService.credentials.isSupervisor;

    this.menus = [];

    if (this.show) {
      /* VIEW */
      this.menus.push({
        title: this.translateService.instant('common.menu.viewedit'),
        icon: 'fa-edit',
        children: [
          {
            title: this.translateService.instant('common.menu.viewedit.deploymentview'),
            link: '/viewedit/deployment-view'
          }
        ]
      });

      if (this.isAdmin || this.isSupervisor) {
        const menu1: Menu = this.menus.find(m => m.title === this.translateService.instant('common.menu.viewedit'));
        menu1.children.push(
          {
            title: this.translateService.instant('common.menu.viewedit.operatorsplanningdashboard'),
            link: '/viewedit/operators-planning-dashboard'
          },
          {
            title: this.translateService.instant('common.menu.viewedit.operatorsacceptancedashboard'),
            link: '/viewedit/operators-acceptance-dashboard'
          }
        );
      }

      if (this.isAdmin || this.isSupervisor || this.isModifyUser) {
        const menu2: Menu = this.menus.find(m => m.title === this.translateService.instant('common.menu.viewedit'));
        menu2.children.push({
          title: this.translateService.instant('common.menu.viewedit.sporouterconffiles'),
          url: this.spoSurveyUrl,
          target: '_blank'
        });
      }

      if (this.isAdmin) {
        const menu3: Menu = this.menus.find(m => m.title === this.translateService.instant('common.menu.viewedit'));
        menu3.children.push(
          {
            title: this.translateService.instant('common.menu.viewedit.ltcbulkmodification'),
            link: '/viewedit/ltc-bulk-modification'
          },
          {
            title: this.translateService.instant('common.menu.viewedit.projectbulkmodification'),
            link: '/viewedit/project-bulk-modification'
          }
        );
      }

      const menu4: Menu = this.menus.find(m => m.title === this.translateService.instant('common.menu.viewedit'));
      menu4.children.push({
        title: this.translateService.instant('common.menu.viewedit.sirenecontacts'),
        url: this.sireneContactUrl,
        target: '_blank'
      });

      /* CONFIGURATION */
      if (this.isAdmin) {
        this.menus.push({
          title: this.translateService.instant('common.menu.configuration'),
          icon: 'fa-cog',
          children: [
            {
              title: this.translateService.instant('common.menu.configuration.linkrsmnetwork'),
              link: '/configuration/link-rsm-network'
            },
            {
              title: this.translateService.instant('common.menu.configuration.businessmail'),
              link: '/configuration/business-email'
            }
          ]
        });
      }

      /* REPORT */
      this.menus.push({
        title: this.translateService.instant('common.menu.report'),
        icon: 'fa-chart-pie',
        children: [
          {
            title: this.translateService.instant('common.menu.report.rsm'),
            link: '/report/rsm'
          },
          {
            title: this.translateService.instant('common.menu.report.datehistory'),
            link: '/report/date-history'
          },
          {
            title: this.translateService.instant('common.menu.report.graphical'),
            link: '/report/graphical'
          },
          {
            title: this.translateService.instant('common.menu.report.stats'),
            link: '/report/stats'
          },
          {
            title: this.translateService.instant('common.menu.report.orders'),
            link: '/report/orders'
          },
          {
            title: this.translateService.instant('common.menu.report.trackingsheet'),
            link: '/report/tracking-sheet'
          }
        ]
      });

      /* HELP */
      this.menus.push({
        title: this.translateService.instant('common.menu.help'),
        icon: 'fa-question',
        children: [
          {
            title: 'User Manual (EN)',
            url: 'assets/Delivery_Organizer_User_Manual.doc',
            target: '_blank'
          },
          {
            title: 'Manuel Utilisateur (FR)',
            url: 'assets/Delivery_Organizer_Manuel_Utilisateur.doc',
            target: '_blank'
          }
        ]
      });
    }
  }
}
