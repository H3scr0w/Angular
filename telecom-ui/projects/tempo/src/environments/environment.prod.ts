// `.env.ts` is generated by the `npm run env` command
import env from './.env';

/**
 * The environment variables
 */
export const environment = {
  appName: 'Tempo',
  production: true,
  version: env.npm_package_version,
  oauthBaseUrl: 'https://cloudsso.saint-gobain.com/openam',
  apiBaseUrl: 'https://lan.api.saint-gobain.com',
  apiContextPath: '/sgdsi/lan/oauth/saml',
  clientId: '1096e12c-d160-4085-9abd-c3e2dfbafd87',
  clientSecret: '73c7d099-0b97-4713-be2e-2444a6550261',
  apiTokenPath: '/sgdsi/token',
  whiteAndYellowUrl: 'https://lan.api.saint-gobain.com/sgdsi/groupdirectory/profile/pictures',
  toolboxUrl: 'https://lan.api.saint-gobain.com/sgdsi/toolbox',
  toolboxApplicationPath: '/toolbox/applications',
  serverUrl: '/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'fr-FR'],
  userGroup: 'APP_SGT_TEMPO_USERS',
  rsmGroup: 'APP_SGT_RSM_USERS',
  adminGroup: 'APP_SGT_ADMIN',
  tempoAdminGroup: 'APP_SGT_TEMPO_ADMIN'
};
