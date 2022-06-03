/**
 * The i18 service mock
 */
export class MockI18Service {
  /**
   * The default lang
   */
  lang = 'en-US';

  /**
   * The supported languages
   */
  supportedLanguages: string[] = ['en-US'];

  /**
   * Set the language
   *
   * @param language to set
   */
  set language(language: string) {
    this.lang = language;
  }

  /**
   * Get the language
   */
  get language(): string {
    return this.lang;
  }

  /**
   * Gets the date format
   */
  get dateFormat(): string {
    return 'yyyy/MM/dd';
  }

  /**
   * Gets de date format for PrimeNG Calendar
   */
  get calendarDateFormat(): string {
    return 'yy/mm/dd';
  }
}
