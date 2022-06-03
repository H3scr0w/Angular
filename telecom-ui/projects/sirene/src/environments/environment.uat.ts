// `.env.ts` is generated by the `npm run env` command
import env from './.env';

/**
 * The environment variables
 */
export const environment = {
  appName: 'Sirene',
  production: true,
  version: env.npm_package_version,
  oauthBaseUrl: 'https://uat.cloudgateway.saint-gobain.com/openam',
  apiBaseUrl: 'https://lan.api.saint-gobain.com',
  apiContextPath: '/sgdsi/lan/oauth/uat/saml',
  clientId: '040d8897-ae6b-4399-9826-25d9ba8a76dc',
  clientSecret: '7b2f99c2-435f-496f-962e-f7c1f14491ed',
  apiTokenPath: '/sgdsi/token',
  whiteAndYellowUrl: 'https://lan.api.saint-gobain.com/sgdsi/groupdirectory/profile/pictures',
  toolboxUrl: 'https://lan.api.saint-gobain.com/sgdsi/test/toolbox',
  toolboxApplicationPath: '/toolbox/applications',
  serverUrl: '/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'fr-FR'],
  userGroup: 'APP_SGT_SIRENE_USERS',
  rsmGroup: 'APP_SGT_RSM_USERS',
  adminGroup: 'APP_SGT_ADMIN',
  sireneAdminGroup: 'APP_SGT_SIRENE_ADMIN',
  rsmProfileName: 'SGT RSM',
  doUserGroup: 'APP_SGT_DO_USERS',
  doModifyGroup: 'APP_SGT_DO_MODIFY',
  doSupervisorGroup: 'APP_SGT_DO_SUPERVISOR',
  doAdminGroup: 'APP_SGT_DO_ADMIN',
  spoUserGroup: 'APP_SGT_SPO_USERS',
  spoModifyGroup: 'APP_SGT_SPO_MODIFY',
  spoBsheetModifyGroup: 'APP_SGT_SPO_BSHEET_MODIFY',
  spoContactModifyGroup: 'APP_SGT_SPO_CONTACT_MODIFY',
  spoAdminGroup: 'APP_SGT_SPO_ADMIN'
};