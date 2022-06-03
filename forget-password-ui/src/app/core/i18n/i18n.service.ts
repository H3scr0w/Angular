import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import * as enUS from '../../../translations/en-US.json';
import * as frFR from '../../../translations/fr-FR.json';

import { Logger } from '../logger/logger.service';

/**
 * The logger
 *
 * @type {Logger}
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
   * @param {TranslateService} translateService
   */
  constructor(private translateService: TranslateService) {
    // Embed languages to avoid extra HTTP requests
    translateService.setTranslation('en-US', enUS.default);
    translateService.setTranslation('fr-FR', frFR.default);
  }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   * @param {!string} defaultLanguage The default language to use.
   * @param {Array.<String>} supportedLanguages The list of supported languages.
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
   * @param {string} language The IETF language code to set.
   */
  set language(language: string) {
    language = language || localStorage.getItem(languageKey) || this.translateService.getBrowserCultureLang();
    let isSupportedLanguage = Boolean(
      this.supportedLanguages.find(supportedLanguage => supportedLanguage === language)
    );
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
   * @return {string} The current language code.
   */
  get language(): string {
    return this.translateService.currentLang;
  }
}
