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
}
