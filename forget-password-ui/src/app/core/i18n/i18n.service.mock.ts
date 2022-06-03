/**
 * The i18 service mock
 */
export class MockI18Service {
  /**
   * The default lang
   *
   * @type {string}
   */
  lang = 'en-US';

  /**
   * Set the language
   *
   * @param {string} language
   */
  set language(language: string) {
    this.lang = language;
  }

  /**
   * Get the language
   *
   * @returns {string}
   */
  get language(): string {
    return this.lang;
  }
}
