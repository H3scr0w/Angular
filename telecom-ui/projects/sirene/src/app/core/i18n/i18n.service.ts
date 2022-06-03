import { Injectable } from '@angular/core';
import { Logger } from '@delivery/stgo-common';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import includes from 'lodash/includes';

import enUS from '../../../translations/en-US.json';
import frFR from '../../../translations/fr-FR.json';

/**
 * The logger
 */
const log = new Logger('I18nService');

/**
 * The language key
 */
const languageKey = 'language';

/**
 * The i18 service
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  /**
   * The default language
   */
  defaultLanguage: string;

  /**
   * The Supported languages
   */
  supportedLanguages: string[];

  /**
   * Instantiate the service
   *
   * @param translateService need to be instantiate with language
   */
  constructor(private translateService: TranslateService) {
    // Embed languages to avoid extra HTTP requests
    translateService.setTranslation('en-US', enUS);
    translateService.setTranslation('fr-FR', frFR);
  }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   * @param defaultLanguage The default language to use.
   * @param supportedLanguages The list of supported languages.
   */
  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
    this.language = null;

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem(languageKey, event.lang);
    });
  }

  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   * @param language The IETF language code to set.
   */
  set language(language: string) {
    language = language || localStorage.getItem(languageKey) || this.translateService.getBrowserCultureLang();
    let isSupportedLanguage = includes(this.supportedLanguages, language);

    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      language = language.split('-')[0];
      language = this.supportedLanguages.find(supportedLanguage => supportedLanguage.startsWith(language));
      isSupportedLanguage = Boolean(language);
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }

    log.debug(`Language set to ${language}`);
    this.translateService.use(language);
  }

  /**
   * Gets the current language.
   */
  get language(): string {
    return this.translateService.currentLang;
  }

  /**
   * Gets the date format
   */
  get dateFormat(): string {
    return this.translateService.instant('common.date.format');
  }

  /**
   * Gets de date format for PrimeNG Calendar
   */
  get calendarDateFormat(): string {
    return this.translateService
      .instant('common.date.format')
      .replace('MM', 'mm')
      .replace('yyyy', 'yy');
  }
}
