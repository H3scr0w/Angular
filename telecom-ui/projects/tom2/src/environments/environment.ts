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
  appName: 'Tom2',
  production: false,
  version: env.npm_package_version + '-dev',
  oauthBaseUrl: 'https://uat.cloudgateway.saint-gobain.com/openam',
  apiBaseUrl: 'https://lan.api.saint-gobain.com',
  apiContextPath: '/sgdsi/lan/oauth/uat/saml',
  clientId: '3d261cca-716b-41de-89c8-4186a92a3990',
  clientSecret: '4b94ecaa-2f94-453a-be40-537272f7946e',
  apiTokenPath: '/sgdsi/token',
  whiteAndYellowUrl: 'https://lan.api.saint-gobain.com/sgdsi/groupdirectory/profile/pictures',
  toolboxUrl: 'https://lan.api.saint-gobain.com/sgdsi/test/toolbox',
  toolboxApplicationPath: '/toolbox/applications',
  serverUrl: '/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'fr-FR'],
  userGroup: 'APP_SGT_TOM2_USERS',
  rsmGroup: 'APP_SGT_RSM_USERS',
  adminGroup: 'APP_SGT_ADMIN',
  tom2AdminGroup: 'APP_SGT_TOM2_ADMIN',
  tom2OrderGroup: 'APP_SGT_TOM2_ORDER',
  tom2PmGroup: 'APP_SGT_TOM2_PM',
  tom2RequesterGroup: 'APP_SGT_TOM2_REQUESTER'
};
