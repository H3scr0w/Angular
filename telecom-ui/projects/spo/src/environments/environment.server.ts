// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// `.env.ts` is generated by the `npm run env` command
import env from './.env';

/**
 * The environment variables
 */
export const environment = {
  appName: 'Spo',
  production: false,
  version: env.npm_package_version + '-dev',
  oauthBaseUrl: 'https://uat.cloudgateway.saint-gobain.com/openam',
  apiBaseUrl: 'https://lan.api.saint-gobain.com',
  apiContextPath: '/sgdsi/lan/oauth/uat/saml',
  clientId: '8d03e1a2-b788-44a4-ad10-426dac5d3bb7',
  clientSecret: '0f5738b6-9964-4934-b815-997bc0035229',
  apiTokenPath: '/sgdsi/token',
  whiteAndYellowUrl: 'https://lan.api.saint-gobain.com/sgdsi/groupdirectory/profile/pictures',
  toolboxUrl: 'https://lan.api.saint-gobain.com/sgdsi/test/toolbox',
  toolboxApplicationPath: '/toolbox/applications',
  serverUrl: '/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'fr-FR'],
  userGroup: 'APP_SGT_SPO_USERS',
  rsmGroup: 'APP_SGT_RSM_USERS',
  adminGroup: 'APP_SGT_ADMIN',
  spoAdminGroup: 'APP_SGT_SPO_ADMIN'
};
