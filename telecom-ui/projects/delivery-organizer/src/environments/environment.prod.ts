// `.env.ts` is generated by the `npm run env` command
import env from './.env';

/**
 * The environment variables
 */
export const environment = {
  appName: 'DeliveryOrganizer',
  production: true,
  version: env.npm_package_version,
  oauthBaseUrl: 'https://cloudsso.saint-gobain.com/openam',
  apiBaseUrl: 'https://lan.api.saint-gobain.com',
  apiContextPath: '/sgdsi/lan/oauth/saml',
  clientId: '685c3cc6-37dc-47a7-9330-620fa1f06fef',
  clientSecret: '358019d4-f1c1-4e59-91c0-810b15bd0522',
  apiTokenPath: '/sgdsi/token',
  whiteAndYellowUrl: 'https://lan.api.saint-gobain.com/sgdsi/groupdirectory/profile/pictures',
  toolboxUrl: 'https://lan.api.saint-gobain.com/sgdsi/toolbox',
  toolboxApplicationPath: '/toolbox/applications',
  serverUrl: '/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'fr-FR'],
  sireneContactUrl: 'https://sirene.saint-gobain.com/definition/contact',
  spoSurveyUrl: 'http://service.sgt.saint-gobain.net/XSPO/search-site-survey',
  userGroup: 'APP_SGT_DO_USERS',
  modifyGroup: 'APP_SGT_DO_MODIFY',
  supervisorGroup: 'APP_SGT_DO_SUPERVISOR',
  adminGroup: 'APP_SGT_ADMIN',
  doAdminGroup: 'APP_SGT_DO_ADMIN'
};