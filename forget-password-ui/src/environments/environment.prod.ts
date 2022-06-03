// `.env.ts` is generated by the `npm run env` command
import env from './.env';

/**
 * The environment variables
 */
export const environment = {
  appName: 'Forget-password-ui',
  production: true,
  version: env.npm_package_version,
  siteKey: '6LdHWIIUAAAAAIQWs26rOtkjkL7XX8Bi1ivQgxqk',
  serverUrl: '/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'fr-FR'],
  oauthBaseUrl: 'https://cloudsso.saint-gobain.com/openam',
  extranetUrl: 'https://employee.extranet.saint-gobain.com'
};
