// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-spec-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      dir: './reports/coverage',
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'spec'],
    port: 9876,
    colors: true,
    // Level of logging, can be: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    browsers: ['Chrome', 'ChromeNoBackground', 'ChromeNoSandbox'],
    customLaunchers: {
      ChromeNoBackground: {
        base: 'Chrome',
        flags: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding']
      },
      ChromeNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
        displayName: 'Chrome no sandbox'
      }
    },
    browserNoActivityTimeout: 30000
  });
};
