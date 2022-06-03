module.exports = {
  testURL: 'http://localhost/',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/jest.ts'],
  coverageDirectory: '../../reports/delivery-organizer/test-results/',
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.html$',
      tsConfig: '<rootDir>/tsconfig.spec.json',
      astTransformers: [
        require.resolve('jest-preset-angular/build/InlineFilesTransformer'),
        require.resolve('jest-preset-angular/build/StripStylesTransformer'),
      ]
    }
  },
  moduleNameMapper: {
    '@core': '<rootDir>/src/app/core',
    '@shared': '<rootDir>/src/app/shared',
    'env/(.*)': '<rootDir>/src/environments/$1'
  },
  reporters: ['default'],
  testResultsProcessor: 'jest-sonar-reporter',
  transformIgnorePatterns: ['node_modules/(?!@angular/common/locales)'],
  testMatch: ['<rootDir>/src/**/@(*.)@(spec.ts)'],
  testPathIgnorePatterns: ['<rootDir>/src/test.common.spec.ts', '<rootDir>/src/app/core/shell/shell.component.spec.ts'],
  rootDir: '../'
};
