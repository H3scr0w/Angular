// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// `.env.ts` is generated by the `npm run env` command
import { env } from './.env';

/**
 * The environment variables
 */
export const environment = {
  appName: 'Webconsole',
  production: false,
  version: env.npm_package_version + '-dev',
  casBaseUrl: 'https://uat.sso.website4sg.saint-gobain.com/cas',
  apiBaseUrl: 'https://lan.api.saint-gobain.com',
  urlAccessToken: '/sgdsi/lan/oauth/uat/token',
  clientId: 'cbf5727f-5996-4fac-8dbf-9361cfed4737',
  serverUrl: '/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'fr-FR'],
  adminRight: '*:*:ADMIN',
  appLanName: 'localhost',
  gitUrl: 'http://uat.code.website4sg.saint-gobain.com',
  supportUrl: 'http://uat.support.website4sg.saint-gobain.com'
};
