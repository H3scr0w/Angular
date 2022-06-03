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
    this.menus = [
      {
        title: this.translateService.instant('Home'),
        icon: 'fa-home',
        children: [{ title: this.translateService.instant('Home'), link: '/' }]
      }
    ];
  }
}
