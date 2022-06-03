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
  appName: 'Tempo',
  production: false,
  version: env.npm_package_version + '-dev',
  oauthBaseUrl: 'https://uat.cloudgateway.saint-gobain.com/openam',
  apiBaseUrl: 'https://lan.api.saint-gobain.com',
  apiContextPath: '/sgdsi/lan/oauth/uat/saml',
  clientId: 'baa40763-8640-4491-bffa-b5c456eddc78',
  clientSecret: 'fbd34ec5-692d-4254-b441-e207ef7aa587',
  apiTokenPath: '/sgdsi/token',
  whiteAndYellowUrl: 'https://lan.api.saint-gobain.com/sgdsi/groupdirectory/profile/pictures',
  toolboxUrl: 'https://lan.api.saint-gobain.com/sgdsi/test/toolbox',
  toolboxApplicationPath: '/toolbox/applications',
  serverUrl: '/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'fr-FR'],
  userGroup: 'APP_SGT_TEMPO_USERS',
  rsmGroup: 'APP_SGT_RSM_USERS',
  adminGroup: 'APP_SGT_ADMIN',
  tempoAdminGroup: 'APP_SGT_TEMPO_ADMIN'
};
